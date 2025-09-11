import { create } from 'zustand';
import type { ProfilePanelStore } from '../types/profile';

export const useProfileStore = create<ProfilePanelStore>((set) => ({
  profilePanelMode: 'profile', // 기본값: 프로필 모드
  setProfilePanelMode: (mode) =>
    set({
      profilePanelMode: mode,
    }),
}));
