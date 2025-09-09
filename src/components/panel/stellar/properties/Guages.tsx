import { Slider } from '@/components/common/Slider';
import Card from '@/components/common/Card';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

interface GuagesProps {
  properties: {
    key: string;
    label: string;
    value: number;
    min: number;
    max: number;
  }[];
}

export default function Guages({ properties }: GuagesProps) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  return (
    <Card>
      {properties.map((property, index) => (
        <Slider
          key={property.key}
          value={[properties[index].value]}
          onValueChange={(value) => {
            const newValue = { ...properties };
            newValue[index].value = value[0];
            setStellarStore({
              ...stellarStore,
              objects: stellarStore.objects.map((object) =>
                object.id === selectedObjectId
                  ? { ...object, properties: newValue }
                  : object
              ),
            });
          }}
          min={property.min}
          label={property.label}
          property={property.key}
          max={property.max}
          step={1}
        />
      ))}
    </Card>
  );
}
