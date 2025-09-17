// 좋아요 API
import axiosInstance from '@/lib/axios';
import { endpoints } from './endpoints';

export const favoriteAPI = {
  // 등록 (팔로우)
  createFavorite: async (targetId: string) => {
    const response = await axiosInstance.post(endpoints.follows.base, {
      system_id: targetId,
    });
    return response.data;
  },

  // 삭제 (언팔로우)
  deleteFavorite: async (targetId: string) => {
    const response = await axiosInstance.delete(endpoints.follows.base, {
      data: { system_id: targetId },
    });
    return response.data;
  },
};
