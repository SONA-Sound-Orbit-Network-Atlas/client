import Card from '@/components/common/Card/Card';
import type { Star, Planet } from '@/types/stellar';
import { mergeClassNames } from '@/utils/mergeClassNames';
import { valueToColor } from '@/utils/valueToColor';

interface StellarCardProps {
  data: Star | Planet;
  onClick: () => void;
  active: boolean;
  className?: string;
  title: string;
}

export default function StellarCard({
  data,
  onClick,
  active,
  className,
  title,
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
        <div
          className={`w-[24px] h-[24px] rounded-full border-[2px] border-[rgba(255,255,255,0.2)]`}
          // style={{ backgroundColor: getPlanetColor(index) }}
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
        <div>
          <strong className="text-text-white">{title}</strong>
          <p className="text-text-muted">{description}</p>
        </div>
      </div>
    </Card>
  );
}
