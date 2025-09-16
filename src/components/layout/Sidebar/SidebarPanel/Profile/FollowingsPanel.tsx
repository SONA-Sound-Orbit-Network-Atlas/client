import {
  navigateToOtherUserProfile,
  navigateBack,
} from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function FollowingsPanel() {
  // 테스트용 하드코딩된 팔로잉 데이터
  const followings = [
    {
      id: 201,
      username: 'Grace',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
    {
      id: 202,
      username: 'Henry',
      isFollowing: true,
      isMutualFollow: false,
    },
    {
      id: 203,
      username: 'Ivy',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
    {
      id: 204,
      username: 'Jack',
      isFollowing: true,
      isMutualFollow: false,
    },
    {
      id: 205,
      username: 'Kate',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
    {
      id: 206,
      username: 'Liam',
      isFollowing: true,
      isMutualFollow: false,
    },
  ];

  const handleUnfollow = (userId: number) => {
    console.log('Unfollow user:', userId);
    // TODO: API 호출로 언팔로우 처리
  };

  const handleUserClick = (userId: number) => {
    navigateToOtherUserProfile(userId);
  };

  return (
    <>
      <PanelHeader
        title="FOLLOWINGS"
        showBackButton={true}
        onBack={navigateBack}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              FOLLOWINGS ({followings.length})
            </p>
            <div className="space-y-3">
              {followings.map((following) => (
                <UserCard
                  key={following.id}
                  id={following.id}
                  username={following.username}
                  isFollowing={following.isFollowing}
                  isMutualFollow={following.isMutualFollow}
                  onUnfollow={handleUnfollow}
                  onClick={handleUserClick}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
