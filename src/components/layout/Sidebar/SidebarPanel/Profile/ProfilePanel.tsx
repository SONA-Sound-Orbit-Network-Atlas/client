import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import LoginPanel from './LoginPanel';
import SignUpPanel from './SignUpPanel';
import ProfileView from './ProfileView';
import OtherUserProfileView from './OtherUserProfileView';
import EditProfilePanel from './EditProfilePanel';
import LikesPanel from './LikesPanel';
import FollowersPanel from './FollowersPanel';
import FollowingsPanel from './FollowingsPanel';

export default function ProfilePanel() {
  const { isLoggedIn } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();

  const renderContent = () => {
    if (!isLoggedIn) {
      // 로그인되지 않은 상태
      switch (profilePanelMode) {
        case 'signup':
          return <SignUpPanel />;
        default:
          return <LoginPanel />;
      }
    }

    // 로그인된 상태
    switch (profilePanelMode) {
      case 'otherUserProfile':
        return viewingUserId ? (
          <OtherUserProfileView userId={viewingUserId} />
        ) : (
          <ProfileView />
        );
      case 'otherUserFollowers':
        return <FollowersPanel />;
      case 'otherUserFollowings':
        return <FollowingsPanel />;
      case 'editProfile':
        return <EditProfilePanel />;
      case 'likes':
        return <LikesPanel />;
      case 'followers':
        return <FollowersPanel />;
      case 'followings':
        return <FollowingsPanel />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {renderContent()}
    </div>
  );
}
