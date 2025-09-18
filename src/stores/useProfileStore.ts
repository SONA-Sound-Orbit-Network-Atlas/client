import { create } from 'zustand';
import type {
  ProfilePanelStore,
  NavigationHistoryItem,
} from '../types/profile';

export const useProfileStore = create<ProfilePanelStore>((set, get) => ({
  profilePanelMode: 'profile', // 기본값: 프로필 모드
  viewingUserId: null, // 기본값: 다른 유저 프로필 보기 중이 아님
  navigationHistory: [], // 네비게이션 히스토리

  setProfilePanelMode: (mode) =>
    set({
      profilePanelMode: mode,
    }),

  setViewingUserId: (userId) =>
    set({
      viewingUserId: userId,
    }),

  pushNavigationHistory: () => {
    const currentState = get();
    const newHistoryItem: NavigationHistoryItem = {
      mode: currentState.profilePanelMode,
      viewingUserId: currentState.viewingUserId,
    };

    set({
      navigationHistory: [...currentState.navigationHistory, newHistoryItem],
    });
  },

  popNavigationHistory: () => {
    const currentState = get();
    if (currentState.navigationHistory.length === 0) {
      return null;
    }

    const lastItem =
      currentState.navigationHistory[currentState.navigationHistory.length - 1];
    const newHistory = currentState.navigationHistory.slice(0, -1);

    set({
      navigationHistory: newHistory,
      profilePanelMode: lastItem.mode,
      viewingUserId: lastItem.viewingUserId,
    });

    return lastItem;
  },

  clearNavigationHistory: () =>
    set({
      navigationHistory: [],
    }),
}));
