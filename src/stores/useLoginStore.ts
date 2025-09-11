import { create } from 'zustand';

interface LoginStore {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set({ isLoggedIn });
  },
}));
