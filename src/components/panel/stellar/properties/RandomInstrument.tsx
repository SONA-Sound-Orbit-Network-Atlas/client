// src/components/panels/Properties/RandomInstrument.tsx
import Button from '@/components/common/Button';
import { useStellarStore } from '@/stores/useStellarStore';
import { createRandomPlanetInstrument } from '@/utils/randomPlanetDetails';

interface RandomInstrumentProps {
  planetId: string | null;
  /** true면 현재 role은 유지하고 synth/osc만 랜덤 */
  lockRole?: boolean;
}

export default function RandomInstrument({
  planetId,
  lockRole = false,
}: RandomInstrumentProps) {
  const { stellarStore, setStellarStore } = useStellarStore();

  const handleClick = () => {
    if (!planetId) return;

    const curr = stellarStore.planets.find((p) => p.id === planetId);
    if (!curr) return;

    const details = createRandomPlanetInstrument(
      lockRole ? curr.role : undefined
    );

    setStellarStore({
      ...stellarStore,
      planets: stellarStore.planets.map((p) =>
        p.id === planetId
          ? {
              ...p,
              role: details.role,
              synthType: details.synthType,
              oscillatorType: details.oscillatorType,
            }
          : p
      ),
    });
  };

  return (
    <Button
      color="secondary"
      size="xs"
      onClick={(e) => {
        e.stopPropagation?.(); // 카드 클릭 버블링 방지
        handleClick();
      }}
    >
      RANDOM
    </Button>
  );
}
