import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followAPI } from '@/api/follow';
import type {
  FollowRequest,
  FollowStats,
  GetFollowersParams,
  FollowersResponse,
} from '@/types/follow';
import type { AxiosError } from 'axios';

// 팔로우 생성
export function useCreateFollow() {
  const queryClient = useQueryClient();

  return useMutation<FollowStats, AxiosError, FollowRequest>({
    mutationFn: (data: FollowRequest) => followAPI.createFollow(data),
    onSuccess: (response: FollowStats) => {
      console.log('✅ 팔로우가 완료되었습니다!', {
        userId: response.userId,
        followersCount: response.followersCount,
        followingsCount: response.followingsCount,
      });

      // 팔로우 관련 쿼리 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: ['userProfile'],
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
    onSuccess: (response: FollowStats) => {
      console.log('✅ 팔로우가 취소되었습니다!', {
        userId: response.userId,
        followersCount: response.followersCount,
        followingsCount: response.followingsCount,
      });
      queryClient.invalidateQueries({
        queryKey: ['userProfile'],
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
    queryKey: ['followers', params.userId, params.page, params.limit],
    queryFn: () => followAPI.getFollowers(params),
    enabled: !!params.userId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    placeholderData: (previousData) => previousData, // 페이지네이션 시 이전 데이터 유지
  });
}

// TODO: 팔로잉 목록 조회
// export function useGetFollowings(userId: string) {
//   return useQuery<User[]>({
//     queryKey: ['followings', userId],
//     queryFn: () => followAPI.getFollowings(userId),
//     enabled: !!userId,
//     staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
//   });
// }

// TODO: 팔로우 상태 확인
// export function useCheckFollowStatus(targetUserId: string) {
//   return useQuery<boolean>({
//     queryKey: ['followStatus', targetUserId],
//     queryFn: () => followAPI.checkFollowStatus(targetUserId),
//     enabled: !!targetUserId,
//     staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
//   });
// }
