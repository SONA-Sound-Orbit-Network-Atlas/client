import Button from '@/components/common/Button';
import { useStellarStore } from '@/stores/useStellarStore';
import type { Star, Planet } from '@/types/stellar';
import {
  createRandomStarProperties,
  createRandomPlanetProperties,
} from '@/utils/randomProperties';

interface RandomProps {
  target: Star | Planet;
}

export default function RandomProperties({ target }: RandomProps) {
  const { stellarStore, setStellarStore } = useStellarStore();

  if (!target) return null;

  const handleRandomClick = () => {
    if (target.object_type === 'STAR') {
      setStellarStore({
        ...stellarStore,
        star: {
          ...stellarStore.star,
          properties: createRandomStarProperties(),
        },
      });
    } else {
      const targetId = target.id; // 선택 스토어 대신 실제 타겟 보장
      const randomized = createRandomPlanetProperties();

      setStellarStore({
        ...stellarStore,
        planets: stellarStore.planets.map((p) =>
          p.id === targetId ? { ...p, properties: randomized } : p
        ),
      });
    }
  };

  return (
    <Button
      color="secondary"
      size="xs"
      onClick={() => {
        handleRandomClick();
      }}
    >
      RANDOM
    </Button>
  );
}
