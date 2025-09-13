import axiosInstance from '@/lib/axios';
import type { User } from '@/types/user';

export const userAPI = {
  // 사용자 프로필 조회
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}/profile`);
    return response.data;
  },
};
