import { Slider } from '@/components/common/Slider';
import Card from '@/components/common/Card/Card';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { valueToColor } from '@/utils/valueToColor';

import { type Star } from '@/types/stellar';
import { type Planet } from '@/types/stellar';
import { PLANET_PROPERTIES } from '@/types/planetProperties';

// === UI에서 사용할 변환 타입 ===
interface UIProperty {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
}

// === Props: 이제 Star 또는 Planet 자체를 받음 ===
interface GaugesProps {
  target: Star | Planet;
}

export default function Gauges({ target }: GaugesProps) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  // 1) Star → UIProperty 배열로 변환
  const toStarUI = (star: Star): UIProperty[] => [
    {
      key: 'spin',
      label: 'Spin',
      value: star.properties.spin,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'brightness',
      label: 'Brightness',
      value: star.properties.brightness,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'color',
      label: 'Color',
      value: star.properties.color,
      min: 0,
      max: 360,
      step: 1,
    },
    {
      key: 'size',
      label: 'Size',
      value: star.properties.size,
      min: 0,
      max: 100,
      step: 1,
    },
  ];

  // 2) Planet → PLANET_PROPERTIES 정의를 참고해 UIProperty 배열로 변환
  const toPlanetUI = (planet: Planet): UIProperty[] => {
    return Object.entries(PLANET_PROPERTIES).map(([key, def]) => ({
      key,
      label: def.label,
      value:
        planet.properties[key as keyof typeof PLANET_PROPERTIES] ??
        def.defaultValue,
      min: def.min,
      max: def.max,
      step: def.step,
    }));
  };

  // 3) 실제 표시할 속성 목록
  const uiProperties: UIProperty[] =
    'spin' in target.properties
      ? toStarUI(target as Star)
      : toPlanetUI(target as Planet);

  // 4) 업데이트 핸들러
  const updateProperty = (propKey: string, newValue: number) => {
    if ('spin' in target.properties) {
      // === Star ===
      setStellarStore({
        ...stellarStore,
        star: {
          ...stellarStore.star!,
          properties: {
            ...stellarStore.star!.properties,
            [propKey]: newValue,
          },
        },
      });
    } else {
      // === Planet ===
      setStellarStore({
        ...stellarStore,
        planets: stellarStore.planets.map((planet) =>
          planet.id === selectedObjectId
            ? {
                ...planet,
                properties: {
                  ...planet.properties,
                  [propKey]: newValue,
                },
              }
            : planet
        ),
      });
    }
  };

  return (
    <Card>
      <div className="space-y-3">
        {uiProperties.map((prop) => {
          const rangeColor =
            prop.key === 'planetColor'
              ? valueToColor(prop.value, prop.min, prop.max)
              : undefined;

          return (
            <Slider
              key={prop.key}
              value={[prop.value]}
              onValueChange={(value) => updateProperty(prop.key, value[0])}
              min={prop.min}
              max={prop.max}
              step={prop.step ?? 1}
              label={prop.label}
              rangeColor={rangeColor}
            />
          );
        })}
      </div>
    </Card>
  );
}
