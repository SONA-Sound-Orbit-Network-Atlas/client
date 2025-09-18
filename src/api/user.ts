import axiosInstance from '@/lib/axios';
import type { User } from '@/types/user';
import { endpoints } from './endpoints';

export interface UpdateProfileRequest {
  username: string;
  about: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface DeactivateAccountRequest {
  password: string;
}

export const userAPI = {
  // 사용자 프로필 조회
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(
      endpoints.user.profileById(userId)
    );
    return response.data;
  },

  // 사용자 프로필 수정
  updateUserProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const response = await axiosInstance.put(endpoints.user.profile, data);
    return response.data;
  },

  // 사용자 비밀번호 변경
  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    await axiosInstance.patch(endpoints.user.password, data);
  },

  // 회원탈퇴
  deactivateAccount: async (data: DeactivateAccountRequest): Promise<void> => {
    await axiosInstance.delete(endpoints.user.base, { data });
  },
};
