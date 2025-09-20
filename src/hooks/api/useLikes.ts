// hooks/api/useLikes.ts
import { useState, useCallback, useEffect } from 'react';
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { likesAPI } from '@/api/likes';
import type { StellarListPage, StellarListItem } from '@/types/stellarList';
import { useUserStore } from '@/stores/useUserStore';
import { likesKeys } from './queryKeys/likesKeys';

// 무한스크롤 페이지 타입
type StellarInfinite = InfiniteData<StellarListPage>;

// 낙관적 업데이트용 패치 함수
function patchLike(
  prev: StellarInfinite,
  system_id: string,
  nextLike: boolean
): StellarInfinite {
  // pages가 없거나 배열이 아닌 경우 안전하게 처리
  if (!prev?.pages || !Array.isArray(prev.pages)) {
    return prev;
  }

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      list: page.list.map((item) =>
        item.id === system_id
          ? {
              ...item,
              is_liked: nextLike,
              like_count: Math.max(0, item.like_count + (nextLike ? 1 : -1)),
            }
          : item
      ),
    })),
  };
}

const LIST_QUERY_KEY: QueryKey = likesKeys.stellarList();

/** 공통 좋아요 뮤테이션 로직 - 중복 제거 */
function useLikeMutation(isCreate: boolean) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ system_id }: { system_id: string }) =>
      isCreate
        ? likesAPI.createLike(system_id)
        : likesAPI.deleteLike(system_id),

    // 낙관적 업데이트
    onMutate: async ({ system_id }) => {
      await qc.cancelQueries({ queryKey: LIST_QUERY_KEY });

      // 현재 캐시 스냅샷 저장
      const snapshots = qc.getQueriesData<StellarInfinite>({
        queryKey: LIST_QUERY_KEY,
      });

      // 캐시 패치
      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<StellarInfinite>(
          key,
          patchLike(data, system_id, isCreate)
        );
      });

      return { snapshots };
    },

    // 실패 시 롤백
    onError: (_error, _vars, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    // 성공/실패 무관 재검증
    onSettled: () => {
      qc.invalidateQueries({ queryKey: LIST_QUERY_KEY, refetchType: 'active' });
      qc.invalidateQueries({
        queryKey: likesKeys.myLikes(),
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: likesKeys.myLikesInfinite(),
        refetchType: 'active',
      });
    },
  });
}

/** 좋아요 등록 */
export function useCreateLike() {
  return useLikeMutation(true);
}

/** 좋아요 삭제 */
export function useDeleteLike() {
  return useLikeMutation(false);
}

/** 내가 좋아요 한 항성계 목록 조회 */
export function useGetMyLikes(params: { page?: number; limit?: number }) {
  const query = useQuery({
    queryKey: likesKeys.myLikes(params.page, params.limit), // 파라미터를 포함하여 캐시 분리
    queryFn: () => likesAPI.getMyLikes(params),
    staleTime: 5 * 60 * 1000, // 5분
  });

  return query;
}

/** 내가 좋아요 한 항성계 목록 조회 (무한스크롤) */
export function useGetMyLikesInfinite(options: { limit?: number } = {}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery<
    StellarListPage,
    Error,
    InfiniteData<StellarListPage>,
    (string | number | undefined)[],
    number
  >({
    queryKey: [...likesKeys.myLikesInfinite(options.limit)],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        page: pageParam as number,
        limit: options.limit || 20,
      };
      return likesAPI.getMyLikes(params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: StellarListPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      const currentPage = allPages.length;

      // 현재 페이지가 마지막 페이지인지 확인
      const isLastPage = currentPage >= totalPages;

      // 현재 페이지의 아이템 수가 limit보다 적으면 마지막 페이지
      const isPartialPage = lastPage.list.length < lastPage.limit;

      // 더 불러올 페이지가 있는지 확인
      const hasMorePages = !isLastPage && !isPartialPage;

      return hasMorePages ? currentPage + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 방지
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error.message.includes('404')) return false;
      return failureCount < 3;
    },
  });

  // 중복 제거 유틸리티 함수
  const removeDuplicates = (items: StellarListItem[]): StellarListItem[] => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  };

  // 모든 페이지의 데이터를 누적하여 하나의 배열로 만들기
  const allItems = data?.pages
    ? removeDuplicates(data.pages.flatMap((page) => page.list))
    : [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    allItems,
    hasMore: hasNextPage === true,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    error,
    loadMore,
    totalCount: data?.pages?.[0]?.total || 0,
    refetch,
  };
}

/** 통합된 좋아요 토글 훅 - 중복 로직 제거 */
export function useLikeToggle(system_id: string, initialLiked: boolean) {
  const { isLoggedIn } = useUserStore();
  const [likeStatus, setLikeStatus] = useState<boolean>(initialLiked);
  const { mutate: createLike, isPending: creating } = useCreateLike();
  const { mutate: deleteLike, isPending: deleting } = useDeleteLike();

  const isPending = creating || deleting;

  // initialLiked prop이 변경될 때 likeStatus 상태를 동기화
  useEffect(() => {
    setLikeStatus(initialLiked);
  }, [initialLiked]);

  const toggleLike = useCallback(() => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    if (isPending) return; // 중복 클릭 차단

    if (likeStatus === true) {
      deleteLike(
        { system_id },
        {
          onSuccess: (data) => {
            console.log('✅ 좋아요 삭제 성공:', { system_id, response: data });
            setLikeStatus(false);
          },
          onError: (error) => {
            console.error('좋아요 삭제 실패:', error);
          },
        }
      );
    } else {
      createLike(
        { system_id },
        {
          onSuccess: (data) => {
            console.log('✅ 좋아요 생성 성공:', { system_id, response: data });
            setLikeStatus(true);
          },
          onError: (error) => {
            console.error('좋아요 생성 실패:', error);
          },
        }
      );
    }
  }, [isLoggedIn, likeStatus, system_id, createLike, deleteLike, isPending]);

  return { likeStatus, toggleLike, isPending };
}
