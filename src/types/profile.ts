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

// 프로필 패널 상태 관련 타입
export interface ProfilePanelState {
  profilePanelMode: ProfilePanelMode;
  viewingUserId: number | null; // 현재 보고 있는 다른 유저의 ID
}

// 프로필 패널 액션 관련 타입
export interface ProfilePanelActions {
  setProfilePanelMode: (mode: ProfilePanelMode) => void;
  setViewingUserId: (userId: number | null) => void;
}

// 통합 프로필 패널 타입
export type ProfilePanelStore = ProfilePanelState & ProfilePanelActions;
