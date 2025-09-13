// 프로필 패널 모드 타입
export type ProfilePanelMode =
  | 'login'
  | 'signup'
  | 'profile'
  | 'editProfile'
  | 'likes'
  | 'followers'
  | 'followings';

// 프로필 패널 상태 관련 타입
export interface ProfilePanelState {
  profilePanelMode: ProfilePanelMode;
}

// 프로필 패널 액션 관련 타입
export interface ProfilePanelActions {
  setProfilePanelMode: (mode: ProfilePanelMode) => void;
}

// 통합 프로필 패널 타입
export type ProfilePanelStore = ProfilePanelState & ProfilePanelActions;
