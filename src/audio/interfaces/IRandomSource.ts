// IRandomSource - 랜덤 생성기 인터페이스
// advancedPattern, Planet 등에서 사용하는 랜덤 함수들의 추상화
// RandomManager, SeededRng 모두 이 인터페이스를 구현할 수 있음

export interface IRandomSource {
  // 기본 랜덤 함수들
  nextFloat(): number; // 0 <= x < 1
  nextInt(min: number, max: number): number; // [min, max]
  choice<T>(arr: T[]): T; // 배열에서 랜덤 선택
}
