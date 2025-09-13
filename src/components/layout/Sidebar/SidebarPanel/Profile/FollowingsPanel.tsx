import { useProfileStore } from '@/stores/useProfileStore';
import PanelHeader from '../PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function FollowingsPanel() {
  const { setProfilePanelMode } = useProfileStore();

  // 임시 데이터
  const followings = [
    {
      id: 1,
      username: 'Following1',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
    {
      id: 2,
      username: 'Following2',
      isFollowing: true,
      isMutualFollow: false,
    },
    {
      id: 3,
      username: 'Following3',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
    {
      id: 4,
      username: 'Following4',
      isFollowing: true,
      isMutualFollow: false,
    },
    {
      id: 5,
      username: 'Following5',
      isFollowing: true,
      isMutualFollow: true, // 서로 팔로우
    },
  ];

  const handleUnfollow = (userId: number) => {
    console.log('Unfollow user:', userId);
    // TODO: API 호출로 언팔로우 처리
  };

  return (
    <>
      <PanelHeader
        title="FOLLOWINGS"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
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
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
