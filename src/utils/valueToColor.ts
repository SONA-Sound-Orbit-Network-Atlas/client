// min ~ max 범위의 값 → HSL 색상 반환
export function valueToColor(value: number, min: number, max: number) {
  if (max === min) {
    return `hsl(0, 100%, 50%)`; // 기본 색상(예: 빨강) 반환
  }
  const ratio = (value - min) / (max - min); // 0~1 정규화
  const hue = ratio * 360; // 0~360 Hue 매핑
  return `hsl(${hue}, 100%, 50%)`; // 채도 100%, 밝기 50%
}
