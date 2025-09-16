import { useProfileStore } from '@/stores/useProfileStore';
import { navigateBack } from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import CardItem from '@/components/panel/galaxy/community/CardItem';
import { ScrollArea } from '@/components/common/Scrollarea';
import type { GalaxyCommunityListData } from '@/types/galaxyCommunity';

export default function LikesPanel() {
  const { viewingUserId } = useProfileStore();

  // 현재 다른 유저의 프로필을 보고 있는지 확인
  const isViewingOtherUser = !!viewingUserId;

  // 임시 데이터 - GalaxyCommunityListData 타입에 맞게 수정
  const likedItems: GalaxyCommunityListData[] = [
    {
      id: '1',
      userId: 'user1',
      rank: 1,
      galaxyName: 'galaxy1',
      makerName: 'User1',
      updatedAt: '2 days ago',
      planetCount: 5,
      favoriteCount: 24,
      myFavorite: true,
    },
    {
      id: '2',
      userId: 'user2',
      rank: 2,
      galaxyName: 'galaxy2',
      makerName: 'User2',
      updatedAt: '1 week ago',
      planetCount: 3,
      favoriteCount: 18,
      myFavorite: true,
    },
    {
      id: '3',
      userId: 'user3',
      rank: 3,
      galaxyName: 'galaxy3',
      makerName: 'User3',
      updatedAt: '3 days ago',
      planetCount: 7,
      favoriteCount: 32,
      myFavorite: true,
    },
    {
      id: '4',
      userId: 'user4',
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
        title={isViewingOtherUser ? 'LIKES' : 'MY LIKES'}
        showBackButton={true}
        onBack={navigateBack}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              {isViewingOtherUser ? 'LIKES' : 'TOTAL LIKES'} (
              {likedItems.length})
            </p>
            <div className="space-y-3">
              {likedItems.map((item) => (
                <CardItem
                  key={item.galaxyName}
                  {...item}
                  onClick={() => {
                    // TODO: 갤럭시 상세 페이지로 이동
                    console.log('Navigate to galaxy:', item.galaxyName);
                  }}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
