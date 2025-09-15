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

  const isPlanet = selectedObjectId !== 'star_001';

  const starObj: Star | undefined = isPlanet ? undefined : stellarStore.star;

  const planetObj: Planet | undefined = isPlanet
    ? stellarStore.planets.find((o) => o.id === selectedObjectId)
    : undefined;

  if (!starObj && !planetObj) return null;

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
              {soundTypeList.map((type) => (
                <Button
                  color="tertiary"
                  size="xs"
                  className="text-xs"
                  onClick={() => {
                    setStellarStore({
                      ...stellarStore,
                      planets: stellarStore.planets.map((planet) => {
                        if (planet.id === selectedObjectId) {
                          return { ...planet, role: type };
                        }
                        return planet;
                      }),
                    });
                  }}
                  clicked={planetObj?.role === type}
                >
                  {type}
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
