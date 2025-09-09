import { useSidebarStore } from '@/stores/sidebarStore';
import PanelHeader from '../PanelHeader';
import CardItem from '@/components/panel/galaxy/community/CardItem';
import { ScrollArea } from '@/components/common/Scrollarea';
import type { GalaxyCommunityListData } from '@/types/galaxyCommunity';

export default function LikesPanel() {
  const { setProfilePanelMode } = useSidebarStore();

  // 임시 데이터 - GalaxyCommunityListData 타입에 맞게 수정
  const likedItems: GalaxyCommunityListData[] = [
    {
      rank: 1,
      galaxyName: 'galaxy1',
      makerName: 'User1',
      updatedAt: '2 days ago',
      planetCount: 5,
      favoriteCount: 24,
      myFavorite: true,
    },
    {
      rank: 2,
      galaxyName: 'galaxy2',
      makerName: 'User2',
      updatedAt: '1 week ago',
      planetCount: 3,
      favoriteCount: 18,
      myFavorite: true,
    },
    {
      rank: 3,
      galaxyName: 'galaxy3',
      makerName: 'User3',
      updatedAt: '3 days ago',
      planetCount: 7,
      favoriteCount: 32,
      myFavorite: true,
    },
    {
      rank: 4,
      galaxyName: 'galaxy4',
      makerName: 'User4',
      updatedAt: '5 days ago',
      planetCount: 4,
      favoriteCount: 15,
      myFavorite: true,
    },
  ];

  return (
    <>
      <PanelHeader
        title="MY LIKES"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              TOTAL LIKES ({likedItems.length})
            </p>
            <div className="space-y-3">
              {likedItems.map((item) => (
                <CardItem key={item.galaxyName} {...item} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
