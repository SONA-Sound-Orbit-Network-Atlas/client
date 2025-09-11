import { Slider } from '@/components/common/Slider';
import Card from '@/components/common/Card/Card';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

interface GaugesProps {
  properties: {
    label: string;
    value: number;
    min: number;
    max: number;
  }[];
}

export default function Gauges({ properties }: GaugesProps) {
  const { stellarStore, setStellarStore } = useStellarStore();
  const { selectedObjectId } = useSelectedObjectStore();

  return (
    <Card>
      {properties.map((property, index) => (
        <Slider
          key={index}
          value={[properties[index].value]}
          onValueChange={(value) => {
            console.log('value : ', value);
            setStellarStore({
              ...stellarStore,
              objects: stellarStore.objects.map((object) => {
                if (object.planetId !== selectedObjectId) return object;

                const newProperties = object.properties.map(
                  (prop, propIndex) =>
                    propIndex === index ? { ...prop, value: value[0] } : prop
                );
                return { ...object, properties: newProperties };
              }),
            });
          }}
          min={property.min}
          label={property.label}
          property={property.label}
          max={property.max}
          step={1}
        />
      ))}
    </Card>
  );
}
