import Card from '@/components/common/Card/Card';
import type { Object, Planet } from '@/types/stellar';

interface StellarCardProps {
  data: Object;
  index: number;
  onClick: () => void;
  active: boolean;
}

function isPlanet(obj: Object): obj is Planet {
  return obj.planetType === 'PLANET';
}

export default function StellarCard({
  data,
  index,
  onClick,
  active,
}: StellarCardProps) {
  return (
    <Card onClick={onClick} className={active ? 'border-secondary-300' : ''}>
      <div className="flex gap-3 items-center">
        <div
          className={`w-[24px] h-[24px] rounded-full border-[2px] border-[rgba(255,255,255,0.2)]`}
          style={{ backgroundColor: getPlanetColor(index) }}
        ></div>
        <div>
          <strong className="text-text-white">{data.name}</strong>
          <p className="text-text-muted">
            {data.planetType} • {isPlanet(data) ? data.soundType + ' •' : ''}{' '}
            SIZE{' '}
            {
              data.properties.find(
                (property) => property.label === 'planetSize'
              )?.value
            }
          </p>
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
