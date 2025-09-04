import Card from '@/components/common/Card';

interface PlanetCardProps {
  data: {
    name: string;
    type: string;
  };
  index: number;
  onClick: () => void;
  clicked: boolean;
}

export default function PlanetCard({
  data,
  index,
  onClick,
  clicked,
}: PlanetCardProps) {
  return (
    <Card onClick={onClick} className={clicked ? 'border-secondary-300' : ''}>
      <div className="flex gap-3 items-center">
        <div
          className={`w-[24px] h-[24px] rounded-full border-[2px] border-[rgba(255,255,255,0.2)]`}
          style={{ backgroundColor: getPlanetColor(index) }}
        ></div>
        <div>
          <strong className="text-text-white">{data.name}</strong>
          <p className="text-text-muted">{data.type}</p>
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
