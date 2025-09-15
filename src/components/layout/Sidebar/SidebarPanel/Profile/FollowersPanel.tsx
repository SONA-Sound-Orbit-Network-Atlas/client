import { useProfileStore } from '@/stores/useProfileStore';
import PanelHeader from '../PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function FollowersPanel() {
  const { setProfilePanelMode, viewingUserId } = useProfileStore();

  // 현재 다른 유저의 프로필을 보고 있는지 확인
  const isViewingOtherUser = !!viewingUserId;

  // 임시 데이터
  const followers = [
    {
      id: 1,
      username: 'Follower1',
      isFollowing: false,
      isMutualFollow: false,
    },
    {
      id: 2,
      username: 'Follower2',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
    {
      id: 3,
      username: 'Follower3',
      isFollowing: false,
      isMutualFollow: false,
    },
    {
      id: 4,
      username: 'Follower4',
      isFollowing: true,
      isMutualFollow: false,
    },
    {
      id: 5,
      username: 'Follower5',
      isFollowing: false,
      isMutualFollow: false,
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

  return (
    <>
      <PanelHeader
        title="FOLLOWERS"
        showBackButton={true}
        onBack={() =>
          setProfilePanelMode(
            isViewingOtherUser ? 'otherUserProfile' : 'profile'
          )
        }
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
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
