import Button from '@/components/common/Button';
import type { PlanetPropertiesType } from '@/types/planetProperties';
import minMaxRandomNo from '@/utils/minMaxRandomNo';

interface RandomProps {
  planetProperties: PlanetPropertiesType[];
  setPlanetProperties: (properties: PlanetPropertiesType[]) => void;
}

export default function Random({
  planetProperties,
  setPlanetProperties,
}: RandomProps) {
  // min max 배열 생성
  const minMaxArray = planetProperties.map((data) => ({
    min: data.min,
    max: data.max,
  }));
  // min max 범위의 랜덤 숫자 생성
  const randomNumbers = minMaxRandomNo(minMaxArray);
  // planetProperties 와 동일한 형태의 데이터 생성
  const randomProperties = planetProperties.map((property, index) => ({
    ...property,
    value: randomNumbers[index],
  }));

  const handleRandomClick = () => {
    setPlanetProperties(randomProperties);
  };

  return (
    <Button color="secondary" size="xs" onClick={handleRandomClick}>
      RANDOM
    </Button>
  );
}
