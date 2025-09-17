import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import FollowListPanel from '@/components/common/FollowListPanel';
import { userUtils } from '@/constants/user';

export default function FollowersPanel() {
  const { userStore } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();

  // 패널 모드에 따라 다른 사용자 ID 사용
  const targetUserId =
    profilePanelMode === 'followers'
      ? userStore.id // 내 팔로워
      : viewingUserId
        ? userUtils.createUserId(viewingUserId)
        : null; // 다른 사용자 팔로워

  return <FollowListPanel type="followers" targetUserId={targetUserId} />;
}
