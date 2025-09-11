import ButtonFavorite from '@/components/common/ButtonFavorite';
import Card from '@/components/common/Card/Card';
import { IoPlanetOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import type { GalaxyCommunityListData } from '@/types/galaxyCommunity';
import { useCreateFavorite, useDeleteFavorite } from '@/hooks/api/useFavorite';

interface CardItemProps extends GalaxyCommunityListData {
  onClick: () => void;
}

export default function CardItem({
  id,
  rank,
  galaxyName,
  makerName,
  updatedAt,
  planetCount,
  favoriteCount,
  myFavorite, // api 데이터에서 로그인 되어있다면 boolean, 비로그인이면 null
  onClick,
}: CardItemProps) {
  // 좋아요 hook
  const { mutate: createFavorite } = useCreateFavorite();
  const { mutate: deleteFavorite } = useDeleteFavorite();
  // 좋아요 클릭
  const handleClickFavorite = () => {
    if (myFavorite === null) return;

    if (myFavorite === true) {
      deleteFavorite({ targetId: id });
    } else if (myFavorite === false) {
      createFavorite({ targetId: id });
    }
  };

  return (
    <Card onClick={onClick} role="button">
      {/* 카드 상단 : 타이틀 및 좋아요 버튼 */}
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold flex items-center">
            <span className="text-text-muted inline-block mr-2 flex-shrink-0">
              #{rank}
            </span>
            <strong className="text-white truncate flex-1 min-w-0">
              {galaxyName}
            </strong>
          </div>
          <div className="mt-3 flex flex-col items-start gap-1 text-[12px] text-text-muted">
            <span>
              BY <span className="text-primary-300">{makerName}</span>
            </span>
            <span>{updatedAt}</span>
          </div>
        </div>
        {/* 좋아요 버튼 => active에 null 이 들어가면 비로그인 상태이므로 비활성화 */}
        <ButtonFavorite
          className="flex-shrink-0"
          active={myFavorite}
          onClick={handleClickFavorite}
        />
      </div>

      {/* 카드 하단 : 행성 수 및 좋아요 수 */}
      <div className="mt-3 flex gap-4">
        <div>
          <IoPlanetOutline className="inline-block w-[12px] h-[16px] mr-1" />
          {planetCount}
        </div>
        <div>
          <FaRegHeart className="inline-block w-[12px] h-[16px] mr-1" />
          {favoriteCount}
        </div>
      </div>
    </Card>
  );
}
