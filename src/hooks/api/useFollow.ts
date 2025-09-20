import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followAPI } from '@/api/follow';
import type {
  FollowRequest,
  FollowStats,
  GetFollowersParams,
  FollowersResponse,
  GetFollowingsParams,
  FollowingsResponse,
} from '@/types/follow';
import type { AxiosError } from 'axios';
import { followKeys } from './queryKeys/followKeys';

// 팔로우 생성
export function useCreateFollow() {
  const queryClient = useQueryClient();

  return useMutation<FollowStats, AxiosError, FollowRequest>({
    mutationFn: (data: FollowRequest) => followAPI.createFollow(data),
    onSuccess: (response: FollowStats, variables: FollowRequest) => {
      console.log('✅ 팔로우가 완료되었습니다!', {
        userId: response.userId,
        followersCount: response.followersCount,
        followingsCount: response.followingsCount,
      });

      // 팔로우 관련 쿼리 무효화하여 최신 데이터 반영
      const myUserId = response.userId;
      const targetUserId = variables.targetUserId;

      // 내 프로필과 팔로잉 목록 무효화
      queryClient.invalidateQueries({
        queryKey: followKeys.userProfile(myUserId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.followings(myUserId),
      });

      // 상대방의 팔로워 목록과 통계 무효화
      queryClient.invalidateQueries({
        queryKey: followKeys.followers(targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.followCount(targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.userProfile(targetUserId),
      });
    },
    onError: (error: AxiosError) => {
      console.error('팔로우 실패:', error);
    },
  });
}

// 팔로우 취소
export function useDeleteFollow() {
  const queryClient = useQueryClient();

  return useMutation<FollowStats, AxiosError, FollowRequest>({
    mutationFn: (data: FollowRequest) => followAPI.deleteFollow(data),
    onSuccess: (response: FollowStats, variables: FollowRequest) => {
      console.log('✅ 팔로우가 취소되었습니다!', {
        userId: response.userId,
        followersCount: response.followersCount,
        followingsCount: response.followingsCount,
      });

      // 팔로우 관련 쿼리 무효화하여 최신 데이터 반영
      const myUserId = response.userId;
      const targetUserId = variables.targetUserId;

      // 내 프로필과 팔로잉 목록 무효화
      queryClient.invalidateQueries({
        queryKey: followKeys.userProfile(myUserId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.followings(myUserId),
      });

      // 상대방의 팔로워 목록과 통계 무효화
      queryClient.invalidateQueries({
        queryKey: followKeys.followers(targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.followCount(targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.userProfile(targetUserId),
      });
    },
    onError: (error: AxiosError) => {
      console.error('팔로우 취소 실패:', error);
    },
  });
}

// 팔로워 목록 조회
export function useGetFollowers(params: GetFollowersParams) {
  return useQuery<FollowersResponse, AxiosError>({
    queryKey: followKeys.followersList(
      params.userId,
      params.page,
      params.limit
    ),
    queryFn: () => followAPI.getFollowers(params),
    enabled: !!params.userId,
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 방지
    placeholderData: (previousData) => previousData, // 페이지네이션 시 이전 데이터 유지
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// 팔로잉 목록 조회
export function useGetFollowings(params: GetFollowingsParams) {
  return useQuery<FollowingsResponse, AxiosError>({
    queryKey: followKeys.followingsList(
      params.userId,
      params.page,
      params.limit
    ),
    queryFn: () => followAPI.getFollowings(params),
    enabled: !!params.userId,
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 방지
    placeholderData: (previousData) => previousData, // 페이지네이션 시 이전 데이터 유지
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// 팔로우 통계 조회
export function useGetFollowCount(userId: string) {
  return useQuery<FollowStats, AxiosError>({
    queryKey: followKeys.followCount(userId),
    queryFn: () => followAPI.getFollowCount(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 방지
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}
