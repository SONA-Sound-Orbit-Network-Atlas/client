import { useAuthStore } from '@/stores/AuthStore';
import { useProfileStore } from '@/stores/profileStore';
import LoginPanel from './LoginPanel';
import SignUpPanel from './SignUpPanel';
import ProfileView from './ProfileView';
import EditProfilePanel from './EditProfilePanel';
import LikesPanel from './LikesPanel';
import FollowersPanel from './FollowersPanel';
import FollowingsPanel from './FollowingsPanel';

export default function ProfilePanel() {
  const { isLoggedIn } = useAuthStore();
  const { profilePanelMode } = useProfileStore();

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
