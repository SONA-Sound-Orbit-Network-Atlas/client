import axiosInstance from '@/lib/axios';
import { endpoints } from './endpoints';
import type {
  FollowRequest,
  FollowStats,
  GetFollowersParams,
  FollowersResponse,
  GetFollowingsParams,
  FollowingsResponse,
} from '@/types/follow';

export const followAPI = {
  // 팔로우 생성
  createFollow: async (data: FollowRequest): Promise<FollowStats> => {
    const response = await axiosInstance.post(endpoints.follows.base, data);
    return response.data;
  },

  // 팔로우 취소
  deleteFollow: async (data: FollowRequest): Promise<FollowStats> => {
    const response = await axiosInstance.delete(endpoints.follows.base, {
      data,
    });
    return response.data;
  },

  // 팔로워 목록 조회
  getFollowers: async (
    params: GetFollowersParams
  ): Promise<FollowersResponse> => {
    const { userId, page = 1, limit = 20 } = params;

    const response = await axiosInstance.get<FollowersResponse>(
      endpoints.follows.followers(userId),
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },

  // 팔로잉 목록 조회
  getFollowings: async (
    params: GetFollowingsParams
  ): Promise<FollowingsResponse> => {
    const { userId, page = 1, limit = 20 } = params;

    const response = await axiosInstance.get<FollowingsResponse>(
      endpoints.follows.followings(userId),
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },

  // TODO: 팔로우 상태 확인
  // checkFollowStatus: async (targetUserId: string): Promise<boolean> => {
  //   const response = await axiosInstance.get(`/follows/status/${targetUserId}`);
  //   return response.data.isFollowing;
  // },
};
