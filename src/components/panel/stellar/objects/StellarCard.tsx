import Card from '@/components/common/Card/Card';
import type { Star, Planet } from '@/types/stellar';
import { mergeClassNames } from '@/utils/mergeClassNames';

interface StellarCardProps {
  data: Star | Planet;
  index: number;
  onClick: () => void;
  active: boolean;
  className?: string;
  title: string;
}

// true 반환하면 Planet 타입이다 => Planet에만 있는 고유 속성으로 판별해야 함
function isPlanet(data: Star | Planet): data is Planet {
  return (data as Planet).role !== undefined;
}

export default function StellarCard({
  data,
  index,
  onClick,
  active,
  className,
  title,
}: StellarCardProps) {
  const description = isPlanet(data) ? 'PLANET • ' + data.role : 'CENTRAL STAR';

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
        <div
          className={`w-[24px] h-[24px] rounded-full border-[2px] border-[rgba(255,255,255,0.2)]`}
          style={{ backgroundColor: getPlanetColor(index) }}
        ></div>
        <div>
          <strong className="text-text-white">{title}</strong>
          <p className="text-text-muted">{description}</p>
        </div>
      </div>
    </Card>
  );
}

function getPlanetColor(index: number) {
  const palette = [
    '#fbbf24',
    '#22d3ee',
    '#8b5cf6',
    '#ec4899',
    '#10b981',
    '#f59e0b',
  ];
  return palette[index % palette.length];
}
