import { create } from 'zustand';
import type { AuthStore } from '../types/auth';

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: true, // 기본값: 로그인됨 (테스트용)
  setLoginStatus: (status: boolean) =>
    set({
      isLoggedIn: status,
    }),
}));
