import Button from '@/components/common/Button';
import minMaxRandomNo from '@/utils/minMaxRandomNo';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { useStellarStore } from '@/stores/useStellarStore';

interface RandomProps {
  properties: {
    label: string;
    value: number;
    min: number;
    max: number;
  }[];
}

export default function Random({ properties }: RandomProps) {
  const { selectedObjectId } = useSelectedObjectStore();
  const { stellarStore, setStellarStore } = useStellarStore();
  if (!properties) return null;

  const handleRandomClick = () => {
    // min max 배열 생성
    const minMaxArray = properties.map((data) => ({
      min: data.min,
      max: data.max,
    }));
    // min max 범위의 랜덤 숫자 생성
    const randomNumbers = minMaxRandomNo(minMaxArray);
    // planetProperties 와 동일한 형태의 데이터 생성
    const randomProperties = properties.map((property, index) => ({
      ...property,
      value: randomNumbers[index],
    }));

    setStellarStore({
      ...stellarStore,
      objects: stellarStore.objects.map((object) =>
        object.planetId === selectedObjectId
          ? { ...object, properties: randomProperties }
          : object
      ),
    });
  };

  return (
    <Button color="secondary" size="xs" onClick={handleRandomClick}>
      RANDOM
    </Button>
  );
}
