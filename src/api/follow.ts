import axiosInstance from '@/lib/axios';
import type {
  FollowRequest,
  FollowStats,
  GetFollowersParams,
  FollowersResponse,
} from '@/types/follow';

export const followAPI = {
  // 팔로우 생성
  createFollow: async (data: FollowRequest): Promise<FollowStats> => {
    const response = await axiosInstance.post('/follows', data);
    return response.data;
  },

  // 팔로우 취소
  deleteFollow: async (data: FollowRequest): Promise<FollowStats> => {
    const response = await axiosInstance.delete('/follows', { data });
    return response.data;
  },

  // 팔로워 목록 조회
  getFollowers: async (
    params: GetFollowersParams
  ): Promise<FollowersResponse> => {
    const { userId, page = 1, limit = 20 } = params;
    const response = await axiosInstance.get(`/follows/${userId}/followers`, {
      params: { page, limit },
    });
    return response.data;
  },

  // TODO: 팔로잉 목록 조회
  // getFollowings: async (userId: string): Promise<User[]> => {
  //   const response = await axiosInstance.get(`/users/${userId}/followings`);
  //   return response.data;
  // },

  // TODO: 팔로우 상태 확인
  // checkFollowStatus: async (targetUserId: string): Promise<boolean> => {
  //   const response = await axiosInstance.get(`/follows/status/${targetUserId}`);
  //   return response.data.isFollowing;
  // },
};
