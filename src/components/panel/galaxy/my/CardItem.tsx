import Card from '@/components/common/Card/Card';
import { IoPlanetOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import type { StellarListItem } from '@/types/stellarList';

interface CardItemProps extends StellarListItem {
  onClick: () => void;
}

export default function CardItem({
  title,
  updated_at,
  planet_count,
  like_count,
  onClick,
}: CardItemProps) {
  return (
    <Card onClick={onClick} role="button">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-[14px] font-bold min-w-0">
            <strong className="text-white w-0 flex-1 truncate">{title}</strong>
          </div>
          <div className="mt-3 flex flex-col items-start gap-1 text-[12px] text-text-muted">
            <span>{updated_at}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-4">
        <div className="flex-shrink-0">
          <IoPlanetOutline className="inline-block w-[12px] h-[16px] mr-1" />
          {planet_count}
        </div>
        <div className="flex-shrink-0">
          <FaRegHeart className="inline-block w-[12px] h-[16px] mr-1" />
          {like_count}
        </div>
      </div>
    </Card>
  );
}
