import { FiUser, FiUsers } from 'react-icons/fi';
import Iconframe from '../Iconframe';
import Button from '../Button';
import Card from './Card';

interface UserCardProps {
  id: string;
  username: string;
  isFollowing?: boolean;
  isMutualFollow?: boolean;
  isFollowBack?: boolean; // 상대방이 나를 팔로우하고 있는지 여부
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onClick?: (userId: string) => void;
  isLoading?: boolean;
  hideFollowButton?: boolean; // 팔로우 버튼을 숨길지 여부
}

export default function UserCard({
  id,
  username,
  isFollowing = false,
  isMutualFollow = false,
  isFollowBack = false,
  onFollow,
  onUnfollow,
  onClick,
  isLoading = false,
  hideFollowButton = false,
}: UserCardProps) {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
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
          {!hideFollowButton && (
            <Button
              color={isFollowing ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleFollowClick}
              disabled={isLoading}
            >
              {isFollowing
                ? 'Unfollow'
                : isFollowBack
                  ? 'Follow Back'
                  : 'Follow'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
