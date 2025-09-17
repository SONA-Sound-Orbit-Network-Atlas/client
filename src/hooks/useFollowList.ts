import { useState, useEffect } from 'react';
import { useGetFollowers, useGetFollowings } from '@/hooks/api/useFollow';
import type {
  FollowerUser,
  FollowingUser,
  UseFollowListOptions,
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
  const [allUsers, setAllUsers] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 타입에 따라 적절한 API 훅 사용
  const followersQuery = useGetFollowers({
    userId: options.userId,
    page: options.page,
    limit: options.limit,
  });

  const followingsQuery = useGetFollowings({
    userId: options.userId,
    page: options.page,
    limit: options.limit,
  });

  // 현재 타입에 맞는 쿼리 선택
  const currentQuery = type === 'followers' ? followersQuery : followingsQuery;
  const { data, isLoading, error } = currentQuery;

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

  // 사용자 ID 변경 시 상태 초기화
  useEffect(() => {
    setAllUsers([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [options.userId]);

  // 데이터 누적 로직
  useEffect(() => {
    if (data?.meta && data?.items) {
      if (options.page === 1) {
        // 첫 페이지: 기존 데이터 초기화 (중복 제거)
        const uniqueUsers = removeDuplicates(data.items as T[]);
        setAllUsers(uniqueUsers);
      } else {
        // 추가 페이지: 기존 데이터에 추가 (중복 제거)
        setAllUsers((prev) => {
          const combined = [...prev, ...(data.items as T[])];
          const uniqueUsers = removeDuplicates(combined);
          return uniqueUsers;
        });
      }

      // 더 불러올 데이터가 있는지 확인
      const totalPages = Math.ceil(data.meta.total / data.meta.limit);
      const hasMoreData = options.page < totalPages;

      setHasMore(hasMoreData);
      setIsLoadingMore(false);
    }
  }, [data, options.page]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore && !error) {
      setIsLoadingMore(true);
    }
  };

  return {
    allUsers,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    loadMore,
    totalCount: data?.meta?.total || 0,
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
