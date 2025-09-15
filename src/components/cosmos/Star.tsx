// 메인 항성성

import type { CentralStar } from '@/types/stellar';
import { valueToColor } from '@/utils/valueToColor';

interface StarProps {
  centralStar: CentralStar;
  position?: [number, number, number];
  onClick?: () => void;
}

export default function Star({
  centralStar,
  position = [0, 0, 0],
  onClick,
}: StarProps) {
  // CentralStar의 properties에서 필요한 값들을 추출하는 헬퍼 함수
  const getPropertyValue = (
    label: string,
    defaultValue: number = 1
  ): number => {
    const property = centralStar.properties.find(
      (prop) => prop.label === label
    );
    return property?.value ?? defaultValue;
  };

  // 필요한 속성들 추출 (실제 데이터의 속성명 사용)
  const size = getPropertyValue('planetSize', 1); // 0.01 단위로 변환
  const colorValue = getPropertyValue('planetColor', 100);
  const brightness = getPropertyValue('planetBrightness', 0.5); // 0.01 단위로 변환

  // 색상 변환 (숫자 값을 색상으로)
  const color = valueToColor(colorValue, 0, 360);

  return (
    <mesh position={position} onClick={onClick} receiveShadow={false}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={brightness}
      />
    </mesh>
  );
}
