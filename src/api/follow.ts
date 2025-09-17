import axiosInstance from '@/lib/axios';
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

    console.log('=== 팔로워 API 요청 정보 ===');
    console.log('요청 URL:', `/follows/${userId}/followers`);
    console.log('요청 파라미터:', { page, limit });
    console.log('사용자 ID:', userId);

    try {
      const response = await axiosInstance.get<FollowersResponse>(
        `/follows/${userId}/followers`,
        {
          params: {
            page,
            limit,
          },
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );

      console.log('=== 팔로워 API 응답 정보 ===');
      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('요청 URL (실제):', response.config.url);
      console.log('요청 헤더:', response.config.headers);

      // 서버 응답이 이미 올바른 구조이므로 isMutual 필드만 처리
      const responseData = response.data;

      console.log('=== 팔로워 API 원본 응답 ===');
      console.log('원본 응답:', responseData);
      if (responseData.items && responseData.items.length > 0) {
        console.log('첫 번째 아이템:', responseData.items[0]);
        console.log(
          '첫 번째 아이템의 키들:',
          Object.keys(responseData.items[0])
        );
      }

      // isMutual 필드가 없는 경우 기본값 false로 설정
      const processedItems = responseData.items.map((item: any) => ({
        ...item,
        isMutual: item.isMutual ?? false,
      }));

      return {
        ...responseData,
        items: processedItems,
      } as FollowersResponse;
    } catch (error: any) {
      console.error('=== 팔로워 API 에러 ===');
      console.error('에러 객체:', error);
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
        console.error('응답 데이터:', error.response.data);
        console.error('요청 URL:', error.config?.url);
        console.error('요청 헤더:', error.config?.headers);
      } else if (error.request) {
        console.error('요청이 전송되었지만 응답을 받지 못함:', error.request);
      } else {
        console.error('요청 설정 중 에러:', error.message);
      }
      throw error;
    }
  },

  // 팔로잉 목록 조회
  getFollowings: async (
    params: GetFollowingsParams
  ): Promise<FollowingsResponse> => {
    const { userId, page = 1, limit = 20 } = params;

    console.log('=== 팔로잉 API 요청 정보 ===');
    console.log('요청 URL:', `/follows/${userId}/followings`);
    console.log('요청 파라미터:', { page, limit });
    console.log('사용자 ID:', userId);

    try {
      const response = await axiosInstance.get<FollowingsResponse>(
        `/follows/${userId}/followings`,
        {
          params: {
            page,
            limit,
          },
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );

      console.log('=== 팔로잉 API 응답 정보 ===');
      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('요청 URL (실제):', response.config.url);
      console.log('요청 헤더:', response.config.headers);

      // 서버 응답이 이미 올바른 구조이므로 isMutual 필드만 처리
      const responseData = response.data;

      console.log('=== 팔로잉 API 원본 응답 ===');
      console.log('원본 응답:', responseData);
      if (responseData.items && responseData.items.length > 0) {
        console.log('첫 번째 아이템:', responseData.items[0]);
        console.log(
          '첫 번째 아이템의 키들:',
          Object.keys(responseData.items[0])
        );
      }

      // isMutual 필드가 없는 경우 기본값 false로 설정
      const processedItems = responseData.items.map((item: any) => ({
        ...item,
        isMutual: item.isMutual ?? false,
      }));

      return {
        ...responseData,
        items: processedItems,
      } as FollowingsResponse;
    } catch (error: any) {
      console.error('=== 팔로잉 API 에러 ===');
      console.error('에러 객체:', error);
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
        console.error('응답 데이터:', error.response.data);
        console.error('요청 URL:', error.config?.url);
        console.error('요청 헤더:', error.config?.headers);
      } else if (error.request) {
        console.error('요청이 전송되었지만 응답을 받지 못함:', error.request);
      } else {
        console.error('요청 설정 중 에러:', error.message);
      }
      throw error;
    }
  },

  // TODO: 팔로우 상태 확인
  // checkFollowStatus: async (targetUserId: string): Promise<boolean> => {
  //   const response = await axiosInstance.get(`/follows/status/${targetUserId}`);
  //   return response.data.isFollowing;
  // },
};
