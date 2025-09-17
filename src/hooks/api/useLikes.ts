// hooks/api/useLikes.ts
import React from 'react';
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { likesAPI } from '@/api/likes';
import type { StellarListPage } from '@/types/stellarList';

// 무한스크롤 페이지 타입
type StellarInfinite = InfiniteData<StellarListPage>;

// 낙관적 업데이트용 패치 함수
function patchLike(
  prev: StellarInfinite,
  system_id: string,
  nextLike: boolean
): StellarInfinite {
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

const LIST_QUERY_KEY: QueryKey = ['stellarList'];

/** 좋아요 등록 */
export function useCreateLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ system_id }: { system_id: string }) =>
      likesAPI.createLike(system_id),

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
        qc.setQueryData<StellarInfinite>(key, patchLike(data, system_id, true));
      });

      return { snapshots };
    },

    // 성공 시 로그
    onSuccess: (data, { system_id }) => {
      console.log('좋아요를 생성했습니다!', { system_id, response: data });
    },

    // 실패 시 롤백
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    // 성공/실패 무관 재검증
    onSettled: () => {
      qc.invalidateQueries({ queryKey: LIST_QUERY_KEY, refetchType: 'active' });
      qc.invalidateQueries({ queryKey: ['myLikes'], refetchType: 'active' });
      qc.invalidateQueries({
        queryKey: ['myLikesInfinite'],
        refetchType: 'active',
      });
    },
  });
}

/** 좋아요 삭제 */
export function useDeleteLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ system_id }: { system_id: string }) =>
      likesAPI.deleteLike(system_id),

    onMutate: async ({ system_id }) => {
      await qc.cancelQueries({ queryKey: LIST_QUERY_KEY });

      const snapshots = qc.getQueriesData<StellarInfinite>({
        queryKey: LIST_QUERY_KEY,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<StellarInfinite>(
          key,
          patchLike(data, system_id, false)
        );
      });

      return { snapshots };
    },

    // 성공 시 로그
    onSuccess: (data, { system_id }) => {
      console.log('좋아요를 삭제했습니다!', { system_id, response: data });
    },

    onError: (_err, _vars, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: LIST_QUERY_KEY, refetchType: 'active' });
      qc.invalidateQueries({ queryKey: ['myLikes'], refetchType: 'active' });
      qc.invalidateQueries({
        queryKey: ['myLikesInfinite'],
        refetchType: 'active',
      });
    },
  });
}

/** 내가 좋아요 한 항성계 목록 조회 */
export function useGetMyLikes(params: { page?: number; limit?: number }) {
  const query = useQuery({
    queryKey: ['myLikes', params.page, params.limit], // 파라미터를 포함하여 캐시 분리
    queryFn: () => likesAPI.getMyLikes(params),
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 성공 시 로그 출력
  React.useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log('좋아요 목록을 조회했습니다!', {
        params,
        count: query.data.list?.length || 0,
        total: query.data.total || 0,
        response: query.data,
      });
    }
  }, [query.isSuccess, query.data, params]);

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
  } = useInfiniteQuery<
    StellarListPage,
    Error,
    InfiniteData<StellarListPage>,
    (string | number | undefined)[],
    number
  >({
    queryKey: ['myLikesInfinite', options.limit],
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
  const removeDuplicates = (items: any[]): any[] => {
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

  // 성공 시 로그 출력
  React.useEffect(() => {
    if (data && allItems.length > 0) {
      console.log('좋아요 목록을 조회했습니다! (무한스크롤)', {
        totalItems: allItems.length,
        totalPages: data.pages.length,
        hasMore: hasNextPage,
        response: data,
      });
    }
  }, [data, allItems.length, hasNextPage]);

  return {
    allItems,
    hasMore: hasNextPage === true,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    error,
    loadMore,
    totalCount: data?.pages?.[0]?.total || 0,
  };
}
