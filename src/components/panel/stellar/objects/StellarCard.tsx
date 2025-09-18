import Card from '@/components/common/Card/Card';
import type { Star, Planet } from '@/types/stellar';
import { mergeClassNames } from '@/utils/mergeClassNames';
import { valueToColor } from '@/utils/valueToColor';
import { FaStar } from 'react-icons/fa';

interface StellarCardProps {
  data: Star | Planet;
  onClick: () => void;
  active: boolean;
  className?: string;
  name: string;
}

export default function StellarCard({
  data,
  onClick,
  active,
  className,
  name,
}: StellarCardProps) {
  const description =
    data.object_type === 'PLANET' ? 'PLANET • ' + data.role : 'CENTRAL STAR';

  return (
    <Card
      role="button"
      onClick={onClick}
      className={mergeClassNames(
        className,
        active ? 'border-secondary-300' : ''
      )}
    >
      <div className="flex gap-3 items-center">
        {/* 색상 동그라미 */}
        <div
          className={`w-[24px] h-[24px] rounded-full border-[2px] border-[rgba(255,255,255,0.2)] shrink-0`}
          style={{
            backgroundColor: valueToColor(
              data.object_type === 'PLANET'
                ? (data.properties.planetColor ?? 0)
                : (data.properties.color ?? 0),
              0,
              360
            ),
          }}
        ></div>
        {/* 이름과 설명 */}
        <div className="flex-1">
          <strong
            className="block text-text-white"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {name}
          </strong>
          <p className="text-text-muted">{description}</p>
        </div>
        {/* 별자리 아이콘 : STAR 경우만 */}
        {data.object_type === 'STAR' && (
          <div className="w-[24px] h-[24px] shrink-0 text-[#FACC15]">
            <FaStar />
          </div>
        )}
      </div>
    </Card>
  );
}
