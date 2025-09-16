import axiosInstance from '@/lib/axios';
import type {
  FollowRequest,
  FollowStats,
  GetFollowersParams,
  FollowersResponse,
  FollowersResponseRaw,
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
    const response = await axiosInstance.get<FollowersResponseRaw>(
      `/follows/${userId}/followers`,
      {
        params: { page, limit },
      }
    );

    // 백엔드 응답을 Swagger 스펙에 맞는 구조로 변환
    const rawData = response.data;

    // 이미 올바른 구조인 경우 (meta가 있는 경우)
    if ('meta' in rawData && rawData.meta) {
      return rawData as FollowersResponse;
    }

    // 잘못된 구조인 경우 변환
    const transformedData: FollowersResponse = {
      meta: {
        page: rawData.page,
        limit: rawData.limit,
        total: Array.isArray(rawData.total) ? rawData.total[0] : rawData.total,
      },
      items: rawData.items,
    };

    return transformedData;
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
