// 프로필 패널 모드 타입
export type ProfilePanelMode =
  | 'login'
  | 'signup'
  | 'profile'
  | 'editProfile'
  | 'likes'
  | 'followers'
  | 'followings'
  | 'otherUserProfile'
  | 'otherUserFollowers'
  | 'otherUserFollowings';

// 네비게이션 히스토리 항목 타입
export interface NavigationHistoryItem {
  mode: ProfilePanelMode;
  viewingUserId: string | null;
}

// 프로필 패널 상태 관련 타입
export interface ProfilePanelState {
  profilePanelMode: ProfilePanelMode;
  viewingUserId: string | null; // 현재 보고 있는 다른 유저의 ID
  navigationHistory: NavigationHistoryItem[]; // 네비게이션 히스토리
}

// 프로필 패널 액션 관련 타입
export interface ProfilePanelActions {
  setProfilePanelMode: (mode: ProfilePanelMode) => void;
  setViewingUserId: (userId: string | null) => void;
  pushNavigationHistory: () => void;
  popNavigationHistory: () => NavigationHistoryItem | null;
  clearNavigationHistory: () => void;
}

// 통합 프로필 패널 타입
export type ProfilePanelStore = ProfilePanelState & ProfilePanelActions;
