// 유저 데이터
import { create } from 'zustand';
import type { User } from '@/types/user';

interface UserStore {
  userStore: User;
  setUserStore: (userStore: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const dummyUserStore: User = {
  // 테스트 이후 삭제 필요
  userId: 'testUser',
  email: 'test@example.com',
  username: 'testUser',
};

export const useUserStore = create<UserStore>((set) => ({
  userStore: dummyUserStore,
  setUserStore: (userStore: User) => {
    set({ userStore });
  },
  isLoggedIn: true,
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set({ isLoggedIn });
  },
}));
