import ButtonFavorite from '@/components/common/ButtonFavorite';
import Card from '@/components/common/Card/Card';
import { IoPlanetOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import type { StellarListItem } from '@/types/stellarList';
import { useCreateFavorite, useDeleteFavorite } from '@/hooks/api/useFavorite';

interface CardItemProps extends StellarListItem {
  onClick: () => void;
}

export default function CardItem({
  id,
  rank,
  title,
  author_id,
  updated_at,
  planet_count,
  like_count,
  is_liked,
  onClick,
}: CardItemProps) {
  // 좋아요 hook
  const { mutate: createFavorite } = useCreateFavorite();
  const { mutate: deleteFavorite } = useDeleteFavorite();
  // 좋아요 클릭
  const handleClickFavorite = () => {
    if (is_liked === null) return;

    if (is_liked === true) {
      deleteFavorite({ targetId: id });
    } else if (is_liked === false) {
      createFavorite({ targetId: id });
    }
  };

  return (
    <Card onClick={onClick} role="button">
      <div className="flex items-center justify-between min-w-0">
        {' '}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-text-muted flex-shrink-0">#{rank}</span>
            <strong className="text-white w-0 flex-1 truncate">{title}</strong>
          </div>

          <div className="mt-3 flex flex-col items-start gap-1 text-[12px] text-text-muted">
            <span>
              BY <span className="text-primary-300">{author_id}</span>
            </span>
            <span>{updated_at}</span>
          </div>
        </div>
        <ButtonFavorite
          className="flex-shrink-0 ml-3"
          active={is_liked}
          onClick={handleClickFavorite}
        />
      </div>

      {/* 카드 하단 : 행성 수 및 좋아요 수 */}
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
