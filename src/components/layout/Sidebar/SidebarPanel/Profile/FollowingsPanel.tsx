import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import FollowListPanel from '@/components/common/FollowListPanel';

export default function FollowingsPanel() {
  const { userStore } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();

  // 패널 모드에 따라 다른 사용자 ID 사용
  const targetUserId =
    profilePanelMode === 'followings'
      ? userStore.id // 내 팔로잉
      : viewingUserId
        ? `cmf_user_${viewingUserId}`
        : null; // 다른 사용자 팔로잉

  return <FollowListPanel type="followings" targetUserId={targetUserId} />;
}
