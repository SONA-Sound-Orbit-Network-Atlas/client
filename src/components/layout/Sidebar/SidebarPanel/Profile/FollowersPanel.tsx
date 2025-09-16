import {
  navigateToOtherUserProfile,
  navigateBack,
} from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function FollowersPanel() {
  // 테스트용 하드코딩된 팔로워 데이터
  const followers = [
    {
      id: 101,
      username: 'Alice',
      isFollowing: false,
      isMutualFollow: false,
    },
    {
      id: 102,
      username: 'Bob',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
    {
      id: 103,
      username: 'Charlie',
      isFollowing: false,
      isMutualFollow: false,
    },
    {
      id: 104,
      username: 'Diana',
      isFollowing: true,
      isMutualFollow: false,
    },
    {
      id: 105,
      username: 'Eve',
      isFollowing: false,
      isMutualFollow: false,
    },
    {
      id: 106,
      username: 'Frank',
      isFollowing: true,
      isMutualFollow: true,
    },
  ];

  const handleFollow = (userId: number) => {
    console.log('Follow user:', userId);
    // TODO: API 호출로 팔로우 처리
  };

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
        title="FOLLOWERS"
        showBackButton={true}
        onBack={navigateBack}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              FOLLOWERS ({followers.length})
            </p>
            <div className="space-y-3">
              {followers.map((follower) => (
                <UserCard
                  key={follower.id}
                  id={follower.id}
                  username={follower.username}
                  isFollowing={follower.isFollowing}
                  isMutualFollow={follower.isMutualFollow}
                  onFollow={handleFollow}
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
