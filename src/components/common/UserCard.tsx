import { FiUser, FiUsers } from 'react-icons/fi';
import Iconframe from './Iconframe';
import Button from './Button';

interface UserCardProps {
  id: number;
  username: string;
  isFollowing?: boolean;
  isMutualFollow?: boolean;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
}

export default function UserCard({
  id,
  username,
  isFollowing = false,
  isMutualFollow = false,
  onFollow,
  onUnfollow,
}: UserCardProps) {
  const handleFollowClick = () => {
    if (isFollowing && onUnfollow) {
      onUnfollow(id);
    } else if (!isFollowing && onFollow) {
      onFollow(id);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
      <Iconframe size="medium">
        <FiUser className="w-5 h-5 text-text-muted" />
      </Iconframe>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-text-primary font-medium">{username}</span>
          {isMutualFollow && (
            <FiUsers className="w-4 h-4 text-primary-300" title="상호 팔로우" />
          )}
        </div>
        <Button
          color={isFollowing ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleFollowClick}
        >
          {isFollowing ? 'Unfollow' : 'Follow Back'}
        </Button>
      </div>
    </div>
  );
}
