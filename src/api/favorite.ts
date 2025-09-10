// 좋아요 API
import axiosInstance from '@/lib/axios';

export const favoriteAPI = {
  // 등록 (팔로우)
  createFavorite: async (targetId: string) => {
    const response = await axiosInstance.post('/api/follows', { targetId });
    return response.data;
  },

  // 삭제 (언팔로우)
  deleteFavorite: async (targetId: string) => {
    const response = await axiosInstance.delete('/api/follows', {
      data: { targetId },
    });
    return response.data;
  },
};
