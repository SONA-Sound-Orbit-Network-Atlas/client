import Button from '@/components/common/Button';
// ❌ minMaxRandomNo는 정수 전용이라 제거
// import minMaxRandomNo from '@/utils/minMaxRandomNo';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useStellarStore } from '@/stores/useStellarStore';
import type { Star, Planet } from '@/types/stellar';
import {
  PLANET_PROPERTIES,
  type PlanetProperties,
} from '@/types/planetProperties';
import type { StarProperties } from '@/types/starProperties';

interface RandomProps {
  target: Star | Planet; // Star 또는 Planet 전체 객체
}

// step/precision 반영 랜덤 유틸 (컴포넌트 내부에 둠)
function randStep(min: number, max: number, step = 1, precision?: number) {
  const steps = Math.floor((max - min) / step);
  const k = Math.floor(Math.random() * (steps + 1));
  const v = min + k * step;
  return precision != null ? +v.toFixed(precision) : v;
}

export default function Random({ target }: RandomProps) {
  const { selectedObjectId } = useSelectedObjectStore();
  const { stellarStore, setStellarStore } = useStellarStore();

  if (!target) return null;

  const handleRandomClick = () => {
    if (target.object_type === 'STAR') {
      // === STAR: 기존 로직 유지 ===
      const randomized: StarProperties = {
        spin: Math.floor(Math.random() * 101), // 0~100
        brightness: Math.floor(Math.random() * 101), // 0~100
        color: Math.floor(Math.random() * 361), // 0~360
        size: Math.floor(Math.random() * 101), // 0~100
      };

      setStellarStore({
        ...stellarStore,
        star: {
          ...stellarStore.star!,
          properties: randomized,
        },
      });
    } else {
      // === PLANET: step/precision 반영 랜덤 ===
      const randomized = Object.entries(PLANET_PROPERTIES).reduce(
        (acc, [key, def]) => {
          // 서버 제약 보호: inclination은 ±90으로 제한 (원하면 삭제 가능)
          const min = key === 'inclination' ? Math.max(def.min, -90) : def.min;
          const max = key === 'inclination' ? Math.min(def.max, 90) : def.max;

          (acc as PlanetProperties)[key] = randStep(
            min,
            max,
            def.step ?? 1,
            def.precision
          );
          return acc;
        },
        {} as PlanetProperties
      );

      setStellarStore({
        ...stellarStore,
        planets: stellarStore.planets.map((planet) =>
          planet.id === selectedObjectId
            ? { ...planet, properties: randomized }
            : planet
        ),
      });
    }
  };

  return (
    <Button color="secondary" size="xs" onClick={handleRandomClick}>
      RANDOM
    </Button>
  );
}
