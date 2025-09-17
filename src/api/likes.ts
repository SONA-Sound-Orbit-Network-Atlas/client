// 좋아요 API
import axiosInstance from '@/lib/axios';
import { endpoints } from './endpoints';

export const likesAPI = {
  // 좋아요 생성
  createLike: async (targetId: string) => {
    const response = await axiosInstance.post(endpoints.likes.base, {
      system_id: targetId,
    });
    return response.data;
  },

  // 좋아요 삭제
  deleteLike: async (targetId: string) => {
    const response = await axiosInstance.delete(endpoints.likes.base, {
      data: { system_id: targetId },
    });
    return response.data;
  },
};
