import { FiUserCheck } from 'react-icons/fi';
import { useSidebarStore } from '@/stores/sidebarStore';
import PanelHeader from '../PanelHeader';
import Card from '@/components/common/Card';
import Iconframe from '@/components/common/Iconframe';

export default function FollowingsPanel() {
  const { setProfilePanelMode } = useSidebarStore();

  // 임시 데이터
  const followings = [
    { id: 1, username: 'Following1', joinDate: '2024-01-10' },
    { id: 2, username: 'Following2', joinDate: '2024-02-15' },
    { id: 3, username: 'Following3', joinDate: '2024-03-05' },
  ];

  return (
    <>
      <PanelHeader
        title="FOLLOWINGS"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
      />
      <div className="flex flex-col p-4 h-full overflow-hidden"></div>
    </>
  );
}
