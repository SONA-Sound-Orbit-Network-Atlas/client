import { useProfileStore } from '@/stores/useProfileStore';

/**
 * 다른 유저의 프로필을 보기 위한 네비게이션 함수
 * @param userId - 보려는 유저의 ID
 */
export const navigateToOtherUserProfile = (userId: number) => {
  const { setProfilePanelMode, setViewingUserId } = useProfileStore.getState();

  setViewingUserId(userId);
  setProfilePanelMode('otherUserProfile');
};

/**
 * 다른 유저 프로필에서 나가기 (본인 프로필로 돌아가기)
 */
export const navigateBackToOwnProfile = () => {
  const { setProfilePanelMode, setViewingUserId } = useProfileStore.getState();

  setViewingUserId(null);
  setProfilePanelMode('profile');
};
