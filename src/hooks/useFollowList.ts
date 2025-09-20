import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { followAPI } from '@/api/follow';
import type {
  FollowerUser,
  FollowingUser,
  UseFollowListOptions,
  FollowersResponse,
  FollowingsResponse,
} from '@/types/follow';

// 공통 팔로우 사용자 타입
type FollowUser = FollowerUser | FollowingUser;

// 팔로우 리스트 타입
type FollowListType = 'followers' | 'followings';

// 제네릭 팔로우 리스트 훅
export function useFollowList<T extends FollowUser>(
  type: FollowListType,
  options: UseFollowListOptions
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<
    FollowersResponse | FollowingsResponse,
    Error,
    InfiniteData<FollowersResponse | FollowingsResponse>,
    (string | number | undefined)[],
    number
  >({
    queryKey: [type, options.targetId, options.limit],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        targetId: options.targetId,
        page: pageParam as number,
        limit: options.limit || 20,
      };

      return type === 'followers'
        ? followAPI.getFollowers(params)
        : followAPI.getFollowings(params);
    },
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: FollowersResponse | FollowingsResponse,
      allPages
    ) => {
      // 서버에서 hasNext 정보를 제공하는 경우 우선 사용
      if (lastPage.meta.hasNext !== undefined) {
        return lastPage.meta.hasNext ? allPages.length + 1 : undefined;
      }

      // 서버에서 hasNext 정보를 제공하지 않는 경우 클라이언트에서 계산
      const totalPages = Math.ceil(lastPage.meta.total / lastPage.meta.limit);
      const currentPage = allPages.length;

      // 현재 페이지가 마지막 페이지인지 확인
      const isLastPage = currentPage >= totalPages;

      // 현재 페이지의 아이템 수가 limit보다 적으면 마지막 페이지
      const isPartialPage = lastPage.items.length < lastPage.meta.limit;

      // 더 불러올 페이지가 있는지 확인
      const hasMorePages = !isLastPage && !isPartialPage;

      return hasMorePages ? currentPage + 1 : undefined;
    },
    enabled: !!options.targetId,
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 방지
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error.message.includes('404')) return false;
      return failureCount < 3;
    },
  });

  // 중복 제거 유틸리티 함수
  const removeDuplicates = (users: T[]): T[] => {
    const seen = new Set<string>();
    return users.filter((user) => {
      if (seen.has(user.id)) {
        return false;
      }
      seen.add(user.id);
      return true;
    });
  };

  // 모든 페이지의 데이터를 누적하여 하나의 배열로 만들기
  const allUsers = data?.pages
    ? removeDuplicates(data.pages.flatMap((page) => page.items as T[]))
    : [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    allUsers,
    hasMore: hasNextPage === true,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    error,
    loadMore,
    totalCount: data?.pages?.[0]?.meta?.total || 0,
  };
}

// 팔로워 리스트 훅 (기존 호환성 유지)
export function useFollowersList(options: UseFollowListOptions) {
  const result = useFollowList<FollowerUser>('followers', options);
  return {
    allFollowers: result.allUsers,
    hasMore: result.hasMore,
    isLoadingMore: result.isLoadingMore,
    isLoading: result.isLoading,
    error: result.error,
    loadMore: result.loadMore,
    totalCount: result.totalCount,
  };
}

// 팔로잉 리스트 훅 (기존 호환성 유지)
export function useFollowingsList(options: UseFollowListOptions) {
  const result = useFollowList<FollowingUser>('followings', options);
  return {
    allFollowings: result.allUsers,
    hasMore: result.hasMore,
    isLoadingMore: result.isLoadingMore,
    isLoading: result.isLoading,
    error: result.error,
    loadMore: result.loadMore,
    totalCount: result.totalCount,
  };
}
