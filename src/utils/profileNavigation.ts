import { useProfileStore } from '@/stores/useProfileStore';

/**
 * 다른 유저의 프로필을 보기 위한 네비게이션 함수
 * @param userId - 보려는 유저의 ID
 */
export const navigateToOtherUserProfile = (userId: string) => {
  const { setProfilePanelMode, setViewingUserId, pushNavigationHistory } =
    useProfileStore.getState();

  // 현재 상태를 히스토리에 추가
  pushNavigationHistory();

  setViewingUserId(userId);
  setProfilePanelMode('otherUserProfile');
};

/**
 * 이전 화면으로 돌아가기 (히스토리 기반)
 */
export const navigateBack = () => {
  const { popNavigationHistory, profilePanelMode, viewingUserId } =
    useProfileStore.getState();

  const previousState = popNavigationHistory();

  // 히스토리가 없으면 현재 상태에 따라 적절한 기본값으로 돌아가기
  if (!previousState) {
    const { setProfilePanelMode, setViewingUserId } =
      useProfileStore.getState();

    // 현재 다른 유저 프로필을 보고 있다면 해당 유저 프로필로 돌아가기
    if (profilePanelMode.startsWith('otherUser') && viewingUserId) {
      setProfilePanelMode('otherUserProfile');
      // viewingUserId는 이미 설정되어 있으므로 변경하지 않음
    } else {
      // 그 외의 경우에는 내 프로필로 돌아가기
      setViewingUserId(null);
      setProfilePanelMode('profile');
    }
  }
};

/**
 * 다른 유저 프로필에서 나가기 (본인 프로필로 돌아가기) - 레거시 함수
 * @deprecated navigateBack()을 사용하세요
 */
export const navigateBackToOwnProfile = () => {
  navigateBack();
};

// 테스트용: 전역 함수로 등록하여 콘솔에서 호출 가능
if (typeof window !== 'undefined') {
  (window as any).testNavigateToUser = navigateToOtherUserProfile;
  (window as any).testNavigateBack = navigateBackToOwnProfile;
}
