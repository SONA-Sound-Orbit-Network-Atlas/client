import { FiUser } from 'react-icons/fi';
import { useSidebarStore } from '@/stores/sidebarStore';
import PanelHeader from '../PanelHeader';
import Card from '@/components/common/Card';
import Iconframe from '@/components/common/Iconframe';

export default function FollowersPanel() {
  const { setProfilePanelMode } = useSidebarStore();

  // 임시 데이터
  const followers = [
    { id: 1, username: 'Follower1', joinDate: '2024-01-15' },
    { id: 2, username: 'Follower2', joinDate: '2024-02-20' },
    { id: 3, username: 'Follower3', joinDate: '2024-03-10' },
  ];

  return (
    <>
      <PanelHeader
        title="FOLLOWERS"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
      />
      <div className="flex flex-col p-4 h-full overflow-hidden"></div>
    </>
  );
}
