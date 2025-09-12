import axiosInstance from '@/lib/axios';
import axios from 'axios';
import type { LoginData, SignupData, LoginResponse } from '@/types/auth';
import type { User } from '@/types/user';

export const authAPI = {
  // 회원가입
  signup: async (data: SignupData) => {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  // 로그인 시도
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      data
    );
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  // 세션 조회: 200이면 User, 401이면 null을 반환
  getSession: async (): Promise<User | null> => {
    try {
      const response = await axiosInstance.get('/auth/session');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401)
        return null; // 비로그인은 정상 흐름
      throw error; // 그 외는 진짜 에러
    }
  },
};
