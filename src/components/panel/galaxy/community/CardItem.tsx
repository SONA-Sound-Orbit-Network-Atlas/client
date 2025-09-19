import ButtonLike from '@/components/common/ButtonLike';
import Card from '@/components/common/Card/Card';
import { IoPlanetOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import type { StellarListItem } from '@/types/stellarList';
import { useLikeToggle } from '@/hooks/api/useLikes';
import { formatDateToYMD } from '@/utils/formatDateToYMD';
import { useUserStore } from '@/stores/useUserStore';
import Button from '@/components/common/Button';
import { navigateToOtherUserProfile } from '@/utils/profileNavigation';
import { useSidebarStore } from '@/stores/useSidebarStore';

interface CardItemProps extends StellarListItem {
  onClick: () => void;
}

export default function CardItem({
  id,
  rank,
  title,
  creator_id,
  creator_name,
  updated_at,
  planet_count,
  like_count,
  is_liked,
  onClick,
}: CardItemProps) {
  const { isLoggedIn } = useUserStore();
  const { openSecondarySidebar } = useSidebarStore();
  // 통합된 좋아요 훅 사용 - 중복 로직 제거
  const { likeStatus, toggleLike, isPending } = useLikeToggle(id, is_liked);

  return (
    <Card
      onClick={onClick}
      role="button"
      className="hover:bg-white/10 hover:brightness-110"
    >
      <div className="flex items-center justify-between min-w-0 w-full max-w-full">
        {/* ← 왼쪽 영역: 줄어들 수 있게 basis-0 grow min-w-0 */}
        <div className="basis-0 grow min-w-0">
          <div className="flex gap-2 min-w-0">
            <span className="text-text-muted flex-shrink-0">#{rank}</span>
            <strong className="text-white w-0 flex-1 line-clamp-2">
              {title}
            </strong>
          </div>

          <div className="mt-2 min-w-0 w-full space-y-1 text-text-muted">
            <div className="flex items-center min-w-0 w-full overflow-hidden">
              <span className="text-sm inline-block">by</span>
              <Button
                color="transparent"
                size="xxs"
                className="p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('해당 유저의 프로필로 이동');
                  console.log('creator_id : ', creator_id);
                  // 1. 프로필 컴포넌트를 유저id에 맞게 변경
                  navigateToOtherUserProfile(creator_id);
                  // 2. sideBarProfile 패널 열기
                  openSecondarySidebar('profile');
                }}
              >
                <span className="inline-block max-w-[calc(147px-16px)] overflow-hidden text-ellipsis text-[14px] font-bold text-primary-300 hover:underline transition-all transition-duration-300 rounded-[2px]">
                  {creator_name}
                </span>
              </Button>
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-[auto,1fr] gap-1 min-w-0 w-full text-xs mt-2">
              <span className="truncate">{formatDateToYMD(updated_at)}</span>
            </div>
          </div>
        </div>

        {isLoggedIn && (
          <ButtonLike
            className="flex-shrink-0"
            active={likeStatus}
            onClick={toggleLike}
            isPending={isPending}
          />
        )}
      </div>

      <div className="mt-2 flex gap-4">
        <div>
          <IoPlanetOutline className="inline-block w-[12px] h-[16px] mr-1" />
          {planet_count}
        </div>
        <div>
          <FaRegHeart className="inline-block w-[12px] h-[16px] mr-1" />
          {like_count}
        </div>
      </div>
    </Card>
  );
}
