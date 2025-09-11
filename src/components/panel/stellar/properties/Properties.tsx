import PanelTitle from '../../PanelTitle';
import ControlPanel from './Gauges';
import Random from './Random';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useEffect, useMemo, useState } from 'react';
import type { Planet, SoundType } from '@/types/stellar';

const soundTypeList: SoundType[] = ['LEAD', 'BASS', 'ARP', 'PAD', 'DRUM'];

export default function Properties() {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  // 1) 선택 객체를 먼저 계산
  const selectedObj = useMemo(
    () => stellarStore.objects.find((o) => o.planetId === selectedObjectId),
    [stellarStore.objects, selectedObjectId]
  );

  const isPlanet = selectedObj?.planetType === 'PLANET';

  // 2) 훅은 항상 호출
  const [soundType, setSoundType] = useState<SoundType>('LEAD');

  useEffect(() => {
    if (!selectedObj) return;
    setSoundType(isPlanet ? (selectedObj as Planet).soundType : 'LEAD');
  }, [selectedObj, isPlanet]);

  // 3) 훅 호출이 끝난 뒤에야 early return
  if (!selectedObj) return null;

  const properties = selectedObj.properties;
  if (!properties) return null;

  return (
    <div className="space-y-6">
      {/* PLANET DETAILS */}
      {selectedObjectId !== 0 && (
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
                    setSoundType(type);
                    setStellarStore({
                      ...stellarStore,
                      objects: stellarStore.objects.map((object) => {
                        if (
                          object.planetType === 'PLANET' &&
                          object.planetId === selectedObjectId
                        ) {
                          const newObject = { ...object, soundType: type };
                          return newObject;
                        }
                        return object;
                      }),
                    });
                  }}
                  clicked={soundType === type}
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
          <Random properties={properties} />
        </div>

        <ControlPanel properties={properties} />
      </div>
    </div>
  );
}
