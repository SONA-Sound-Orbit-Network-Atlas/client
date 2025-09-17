// 좋아요 API
import axiosInstance from '@/lib/axios';
import { endpoints } from './endpoints';
import type { StellarListPage, StellarListResponse } from '@/types/stellarList';

// 공용 어댑터: 서버 응답 → 앱 포맷
function adaptStellarList(res: StellarListResponse): StellarListPage {
  const { data, meta } = res;
  return {
    list: data,
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
  };
}

export const likesAPI = {
  // 좋아요 생성
  createLike: async (system_id: string) => {
    const response = await axiosInstance.post(endpoints.likes.base, {
      system_id,
    });
    return response.data;
  },

  // 좋아요 삭제
  deleteLike: async (system_id: string) => {
    const response = await axiosInstance.delete(endpoints.likes.base, {
      data: { system_id },
    });
    return response.data;
  },

  // 내가 좋아요 한 항성계 목록 조회
  getMyLikes: async (params: {
    page?: number;
    limit?: number;
  }): Promise<StellarListPage> => {
    const { page = 1, limit = 20 } = params;
    const response = await axiosInstance.get<StellarListResponse>(
      endpoints.likes.me,
      {
        params: { page, limit },
      }
    );

    return adaptStellarList(response.data);
  },
};
