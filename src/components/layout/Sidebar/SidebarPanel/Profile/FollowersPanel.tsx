import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import FollowListPanel from '@/components/common/FollowListPanel';

export default function FollowersPanel() {
  const { userStore } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();

  // 패널 모드에 따라 다른 사용자 ID 사용
  const targetUserId =
    profilePanelMode === 'followers'
      ? userStore.id // 내 팔로워
      : viewingUserId; // 다른 사용자 팔로워

  return <FollowListPanel type="followers" targetUserId={targetUserId} />;
}
