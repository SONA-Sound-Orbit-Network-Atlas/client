// 유저 데이터
import { create } from 'zustand';
import type { User } from '@/types/user';

interface UserStore {
  userStore: User;
  setUserStore: (userStore: User) => void;
  clearUserStore: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  initializeAuth: () => Promise<void>;
}

const initialUserStore: User = {
  id: '', // mock 데이터랑 일치하는 id : user_stann_001
  email: '',
  username: '',
};

export const useUserStore = create<UserStore>((set) => ({
  userStore: initialUserStore,
  setUserStore: (userStore: User) => {
    set({ userStore });
  },
  clearUserStore: () => {
    set({
      userStore: initialUserStore,
      isLoggedIn: false,
    });
  },
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set({ isLoggedIn });
  },
  initializeAuth: async () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // 토큰이 있으면 로그인 상태로 복원 (실제 유효성 검증은 API 호출 시에만)
      // localStorage에서 사용자 정보도 복원
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          set({ userStore: user, isLoggedIn: true });
        } catch (error) {
          set({ isLoggedIn: true }); // 토큰만으로라도 로그인 상태 유지
        }
      } else {
        set({ isLoggedIn: true });
      }
    }
  },
}));
