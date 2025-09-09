import { FiHeart } from 'react-icons/fi';
import { useSidebarStore } from '@/stores/sidebarStore';
import PanelHeader from '../PanelHeader';
import Card from '@/components/common/Card';

export default function LikesPanel() {
  const { setProfilePanelMode } = useSidebarStore();

  // 임시 데이터
  const likedItems = [
    { id: 1, name: 'Galaxy Alpha', type: 'Galaxy', author: 'User1' },
    { id: 2, name: 'Solar System Beta', type: 'System', author: 'User2' },
    { id: 3, name: 'Planet Gamma', type: 'Planet', author: 'User3' },
  ];

  return (
    <>
      <PanelHeader
        title="MY LIKES"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
      />
      <div className="flex flex-col p-4 h-full overflow-hidden"></div>
    </>
  );
}
