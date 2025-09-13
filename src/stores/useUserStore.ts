// 유저 데이터
import { create } from 'zustand';
import type { User } from '@/types/user';

interface UserStore {
  userStore: User;
  setUserStore: (userStore: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const initialUserStore: User = {
  id: '',
  email: '',
  username: '',
};

export const useUserStore = create<UserStore>((set) => ({
  userStore: initialUserStore,
  setUserStore: (userStore: User) => {
    set({ userStore });
  },
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set({ isLoggedIn });
  },
}));
