import { Slider } from '@/components/common/Slider';
import Card from '@/components/common/Card';
import { useEffect } from 'react';
import type { PlanetPropertiesType } from '@/types/planetProperties';

interface GuagesProps {
  planetProperties: PlanetPropertiesType[];
  setPlanetProperties: (properties: PlanetPropertiesType[]) => void;
}

export default function Guages({
  planetProperties,
  setPlanetProperties,
}: GuagesProps) {
  // 나중에 zustand 에 연결
  useEffect(() => {
    // console.log(gaugeValue);
  }, [planetProperties]);

  return (
    <Card>
      {planetProperties.map((property, index) => (
        <Slider
          key={property.name}
          value={[planetProperties[index].value]}
          onValueChange={(value) => {
            const newValue = [...planetProperties];
            newValue[index].value = value[0];
            setPlanetProperties(newValue);
          }}
          min={property.min}
          max={property.max}
          step={1}
          property={property.name}
          label={property.name}
        />
      ))}
    </Card>
  );
}
