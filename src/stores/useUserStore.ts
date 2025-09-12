// 유저 데이터
import { create } from 'zustand';

interface UserType {
  userId: string;
  email: string;
  username: string;
}

interface UserStore {
  userStore: UserType;
  setUserStore: (userStore: UserType) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const dummyUserStore: UserType = {
  userId: 'testUser',
  email: 'test@example.com',
  username: 'testUser',
};

const initialUserStore: UserType = {
  userId: '',
  email: '',
  username: '',
};

export const useUserStore = create<UserStore>((set) => ({
  userStore: dummyUserStore,
  isLoggedIn: false,
  setUserStore: (userStore: UserType) => {
    set({ userStore });
  },
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set({ isLoggedIn });
  },
}));
