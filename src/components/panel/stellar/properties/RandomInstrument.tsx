// src/components/panels/Properties/RandomInstrument.tsx
import Button from '@/components/common/Button';
import { useStellarStore } from '@/stores/useStellarStore';
import { createRandomPlanetInstrument } from '@/utils/randomPlanetDetails';

export default function RandomInstrument({
  planetId,
  lockRole = false,
}: {
  planetId: string;
  /** true면 현재 role은 유지하고 synth/osc만 랜덤 */
  lockRole?: boolean;
}) {
  const { stellarStore, setStellarStore } = useStellarStore();

  const handleClick = () => {
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
