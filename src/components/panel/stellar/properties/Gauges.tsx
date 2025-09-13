import { Slider } from '@/components/common/Slider';
import Card from '@/components/common/Card/Card';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { valueToColor } from '@/utils/valueToColor';

interface GaugesProps {
  properties: {
    label: string;
    value: number;
    min: number;
    max: number;
    unit: number;
  }[];
}

export default function Gauges({ properties }: GaugesProps) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  return (
    <Card>
      <div className="space-y-3">
        {properties.map((property, index) => {
          // 현재 값 기준으로 색 계산 (인라인 배경색)
          const rangeColor =
            property.label === 'planetColor'
              ? valueToColor(property.value, property.min, property.max)
              : undefined;

          return (
            <Slider
              key={index}
              value={[property.value]}
              onValueChange={(value) => {
                setStellarStore({
                  ...stellarStore,
                  objects: stellarStore.objects.map((object) => {
                    if (object.planetId !== selectedObjectId) return object;
                    const newProperties = object.properties.map(
                      (prop, propIndex) =>
                        propIndex === index
                          ? { ...prop, value: value[0] }
                          : prop
                    );
                    return { ...object, properties: newProperties };
                  }),
                });
              }}
              min={property.min}
              max={property.max}
              step={property.unit}
              label={property.label}
              rangeColor={rangeColor}
            />
          );
        })}
      </div>
    </Card>
  );
}
