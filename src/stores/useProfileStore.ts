import { create } from 'zustand';
import type { ProfilePanelStore } from '../types/profile';

export const useProfileStore = create<ProfilePanelStore>((set) => ({
  profilePanelMode: 'profile', // 기본값: 프로필 모드
  viewingUserId: null, // 기본값: 다른 유저 프로필 보기 중이 아님
  setProfilePanelMode: (mode) =>
    set({
      profilePanelMode: mode,
    }),
  setViewingUserId: (userId) =>
    set({
      viewingUserId: userId,
    }),
}));
