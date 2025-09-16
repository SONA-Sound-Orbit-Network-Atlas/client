import Button from '@/components/common/Button';
import minMaxRandomNo from '@/utils/minMaxRandomNo';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useStellarStore } from '@/stores/useStellarStore';
import type { Star } from '@/types/stellar';
import type { Planet } from '@/types/stellar';
import {
  PLANET_PROPERTIES,
  type PlanetProperties,
} from '@/types/planetProperties';
import { type StarProperties } from '@/types/starProperties';

interface RandomProps {
  target: Star | Planet; // Star 또는 Planet 전체 객체
}

export default function Random({ target }: RandomProps) {
  const { selectedObjectId } = useSelectedObjectStore();
  const { stellarStore, setStellarStore } = useStellarStore();

  if (!target) return null;

  const handleRandomClick = () => {
    if (target.object_type === 'STAR') {
      // === STAR 처리 ===
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
      // === PLANET 처리 ===
      const minMaxArray = Object.values(PLANET_PROPERTIES).map((def) => ({
        min: def.min,
        max: def.max,
      }));

      const randomNumbers = minMaxRandomNo(minMaxArray);

      const randomized: PlanetProperties = Object.keys(
        PLANET_PROPERTIES
      ).reduce((acc, key, idx) => {
        acc[key as keyof PlanetProperties] = randomNumbers[idx];
        return acc;
      }, {} as PlanetProperties);

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
