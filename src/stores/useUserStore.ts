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
    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }

    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const user = JSON.parse(userInfoString);
        // user 객체의 구조가 유효한지 검증
        if (
          user &&
          typeof user.id === 'string' &&
          typeof user.email === 'string' &&
          typeof user.username === 'string'
        ) {
          set({ userStore: user, isLoggedIn: true });
          return;
        } else {
          console.warn(
            'localStorage의 userInfo가 유효하지 않은 형식입니다:',
            user
          );
          localStorage.removeItem('userInfo');
        }
      } catch (error) {
        console.error('localStorage의 userInfo 파싱 실패:', error);
        // 손상된 데이터는 삭제
        localStorage.removeItem('userInfo');
      }
    }

    // 토큰은 있지만 userInfo가 없거나 손상된 경우
    set({ isLoggedIn: true });
  },
}));
