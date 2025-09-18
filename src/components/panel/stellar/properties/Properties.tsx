import PanelTitle from '../../PanelTitle';
import ControlPanel from './Gauges';
import Random from './Random';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button';
import type { Planet, Star } from '@/types/stellar';
import { type InstrumentRole } from '@/types/planetProperties';

const soundTypeList: InstrumentRole[] = [
  'DRUM',
  'BASS',
  'CHORD',
  'MELODY',
  'ARPEGGIO',
  'PAD',
];

export default function Properties() {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  const { star, planets } = stellarStore;

  // 선택된 객체 찾기 (STAR 우선, 없으면 PLANET 검색)
  const selection =
    star && star.id === selectedObjectId
      ? { kind: 'STAR' as const, obj: star }
      : (() => {
          const p = planets.find((o) => o.id === selectedObjectId);
          return p ? { kind: 'PLANET' as const, obj: p } : null;
        })();

  if (!selection) return null;

  const isPlanet = selection.kind === 'PLANET';
  const starObj =
    selection.kind === 'STAR' ? (selection.obj as Star) : undefined;
  const planetObj =
    selection.kind === 'PLANET' ? (selection.obj as Planet) : undefined;

  const properties = isPlanet ? planetObj?.properties : starObj?.properties;
  if (!properties) return null;

  return (
    <div className="space-y-6">
      {/* PLANET DETAILS */}
      {isPlanet && (
        <div>
          <PanelTitle
            className="mb-4 text-[16px]"
            textColor="text-secondary-300"
          >
            PLANET DETAILS
          </PanelTitle>

          <Card className="p-[17px] space-y-2">
            <p className="text-text-muted text-xs">SOUND TYPE</p>
            <div className=" flex gap-2 flex-wrap">
              {soundTypeList.map((soundType) => (
                <Button
                  key={soundType}
                  color="tertiary"
                  size="xs"
                  className="text-xs"
                  onClick={() => {
                    setStellarStore({
                      ...stellarStore,
                      planets: stellarStore.planets.map((planet) => {
                        if (planet.id === selectedObjectId) {
                          return { ...planet, role: soundType };
                        }
                        return planet;
                      }),
                    });
                  }}
                  clicked={planetObj?.role === soundType}
                >
                  {soundType}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* PROPERTIES */}
      <div>
        <div className="Properties-Header flex justify-between items-center mb-4">
          <PanelTitle className="mb-0 text-[16px]" textColor="text-primary-300">
            PROPERTIES
          </PanelTitle>
          <Random target={isPlanet ? planetObj! : starObj!} />
        </div>

        <ControlPanel target={isPlanet ? planetObj! : starObj!} />
      </div>
    </div>
  );
}
