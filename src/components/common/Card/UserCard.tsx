import { FiUser, FiUsers } from 'react-icons/fi';
import Iconframe from '../Iconframe';
import Button from '../Button';
import Card from './Card';

interface UserCardProps {
  id: number;
  username: string;
  isFollowing?: boolean;
  isMutualFollow?: boolean;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
  onClick?: (userId: number) => void;
}

export default function UserCard({
  id,
  username,
  isFollowing = false,
  isMutualFollow = false,
  onFollow,
  onUnfollow,
  onClick,
}: UserCardProps) {
  const handleFollowClick = () => {
    if (isFollowing && onUnfollow) {
      onUnfollow(id);
    } else if (!isFollowing && onFollow) {
      onFollow(id);
    }
  };

  return (
    <Card
      className="w-full hover:brightness-110 hover:cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      <div className="flex items-center gap-3">
        <Iconframe color="primary" size="small">
          <FiUser className="w-5 h-5" />
        </Iconframe>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-text-white font-medium">{username}</span>
            {isMutualFollow && (
              <FiUsers className="w-4 h-4 text-primary-300" title="맞팔로우" />
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
    </Card>
  );
}
