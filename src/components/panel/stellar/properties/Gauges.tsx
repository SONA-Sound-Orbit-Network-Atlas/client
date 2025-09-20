import { Slider } from '@/components/common/Slider';
import Card from '@/components/common/Card/Card';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { valueToColor } from '@/utils/valueToColor';

import { type Star } from '@/types/stellar';
import { type Planet } from '@/types/stellar';
import { STAR_PROPERTIES, type StarProperties } from '@/types/starProperties';
import {
  PLANET_PROPERTIES,
  type PlanetProperties,
} from '@/types/planetProperties';

// === UI에서 사용할 변환 타입 ===
interface UIProperty {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
}

// === Props: Star 또는 Planet 자체를 받음 ===
interface GaugesProps {
  target: Star | Planet;
}

export default function Gauges({ target }: GaugesProps) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  // 1) Star → UIProperty 배열로 변환
  const toStarUI = (star: Star): UIProperty[] => {
    return Object.entries(STAR_PROPERTIES).map(([key, def]) => ({
      key,
      label: def.label, // 영어, def.label 한글
      value: star.properties[key as keyof StarProperties] ?? def.defaultValue,
      min: def.min,
      max: def.max,
      step: def.step,
    }));
  };

  // 2) Planet → PLANET_PROPERTIES 정의를 참고해 UIProperty 배열로 변환
  const toPlanetUI = (planet: Planet): UIProperty[] => {
    return Object.entries(PLANET_PROPERTIES).map(([key, def]) => ({
      key,
      label: def.label,
      value:
        planet.properties[key as keyof PlanetProperties] ?? def.defaultValue,
      min: def.min,
      max: def.max,
      step: def.step,
    }));
  };

  // 3) 실제 표시할 속성 목록
  const uiProperties: UIProperty[] =
    target.object_type === 'STAR'
      ? toStarUI(target as Star)
      : toPlanetUI(target as Planet);

  // 4) 업데이트 핸들러
  const updateProperty = (propKey: string, newValue: number) => {
    if (target.object_type === 'STAR') {
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
            prop.key === 'planetColor' || prop.key === 'color'
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
