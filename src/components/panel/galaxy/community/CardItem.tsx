import ButtonLike from '@/components/common/ButtonLike';
import Card from '@/components/common/Card/Card';
import { IoPlanetOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import type { StellarListItem } from '@/types/stellarList';
import { likeUtils } from '@/utils/likeUtils';
import { useLikeToggle } from '@/hooks/api/useLikes';
import { formatDateToYMD } from '@/utils/formatDateToYMD';

interface CardItemProps extends StellarListItem {
  onClick: () => void;
}

export default function CardItem({
  id,
  rank,
  title,
  creator_name,
  updated_at,
  planet_count,
  like_count,
  is_liked,
  onClick,
}: CardItemProps) {
  // 통합된 좋아요 훅 사용 - 중복 로직 제거
  const { likeStatus, toggleLike } = useLikeToggle(id, is_liked);

  return (
    <Card onClick={onClick} role="button">
      <div className="flex items-center justify-between min-w-0 w-full max-w-full">
        {/* ← 왼쪽 영역: 줄어들 수 있게 basis-0 grow min-w-0 */}
        <div className="basis-0 grow min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-text-muted flex-shrink-0">#{rank}</span>
            <strong className="text-white w-0 flex-1 truncate">{title}</strong>
          </div>

          <div className="mt-3 min-w-0 w-full space-y-1 text-[12px] text-text-muted">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '4px',
              }}
              className="min-w-0 w-full"
            >
              <span>BY</span>
              <span className="truncate text-primary-300">{creator_name}</span>
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-[auto,1fr] gap-1 min-w-0 w-full">
              <span className="truncate">{formatDateToYMD(updated_at)}</span>
            </div>
          </div>
        </div>

        <ButtonLike
          className="flex-shrink-0 ml-3"
          active={likeUtils.toBoolean(likeStatus)}
          onClick={toggleLike}
        />
      </div>

      <div className="mt-3 flex gap-4">
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
