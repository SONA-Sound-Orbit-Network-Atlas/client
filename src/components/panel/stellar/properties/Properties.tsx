import PanelTitle from '../../PanelTitle';
import ControlPanel from './Gauges';
import Random from './Random';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

export default function Properties() {
  const { stellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  if (stellarStore.objects.length === 0) return null;

  const properties = stellarStore.objects.find(
    (object) => object.id === selectedObjectId
  )?.properties;

  if (!properties) return null;

  return (
    <div>
      <div className="Properties-Header flex justify-between items-center mb-4">
        <PanelTitle className="mb-0 text-[16px]" textColor="text-primary-300">
          PROPERTIES
        </PanelTitle>

        {/* 랜덤 버튼 */}
        <Random properties={properties} />
      </div>

      {/* 게이지 */}
      <ControlPanel properties={properties} />
    </div>
  );
}
