// 좋아요 API
import axiosInstance from '@/lib/axios';
import { endpoints } from './endpoints';

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
};
