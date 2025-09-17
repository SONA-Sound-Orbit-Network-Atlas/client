// 좋아요 API
import axiosInstance from '@/lib/axios';
import { endpoints } from './endpoints';

export const likesAPI = {
  // 등록 (팔로우)
  createLike: async (targetId: string) => {
    const response = await axiosInstance.post(endpoints.likes.base, {
      system_id: targetId,
    });
    return response.data;
  },

  // 삭제 (언팔로우)
  deleteLike: async (targetId: string) => {
    const response = await axiosInstance.delete(endpoints.likes.base, {
      data: { system_id: targetId },
    });
    return response.data;
  },
};
