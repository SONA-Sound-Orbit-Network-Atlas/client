import Card from '@/components/common/Card';
// import { GoDotFill } from 'react-icons/go';
import ButtonToggleHeart from '@/components/common/ButtonToggleHeart';
import { IoPlanetOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import type { GalaxyMyListData } from '@/types/galaxyMy';

export default function Item({
  galaxyName,
  updatedAt,
  planetCount,
  favoriteCount,
}: GalaxyMyListData) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold flex items-center">
            <strong className="text-white truncate flex-1 min-w-0">
              {galaxyName}
            </strong>
          </div>
          <div className="mt-3 flex flex-col items-start gap-1 text-[12px] text-text-muted">
            <span>{updatedAt}</span>
          </div>
        </div>
        <ButtonToggleHeart className="flex-shrink-0" active={false} />
      </div>
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
