// 매핑/수학 유틸리티 함수들
// 지침의 수식을 그대로 구현한 함수들입니다.

// 값을 범위 내로 제한
export const clamp = (v: number, lo: number, hi: number): number => 
  Math.min(hi, Math.max(lo, v));

// 선형 매핑: n을 [0,1] 범위에서 [a,b] 범위로 변환
export const mapLin = (n: number, a: number, b: number): number => 
  a + (b - a) * n;

// 지수 매핑: n을 [0,1] 범위에서 [a,b] 범위로 지수적 변환
export const mapExp = (n: number, a: number, b: number, k: number = 1): number => 
  a * Math.pow(b / a, Math.pow(clamp(n, 0, 1), k));

// 곡선 함수들
export function curve(n: number, kind: 'exp' | 'log' | 'sigmoid'): number {
  n = clamp(n, 0, 1);
  switch (kind) {
    case 'exp': return Math.pow(n, 2);
    case 'log': return Math.pow(n, 0.5);
    case 'sigmoid': return 1 / (1 + Math.exp(-12 * (n - 0.5)));
  }
}

// beats 값을 Tone.js sync 문자열로 변환
export function syncFromBeats(beats: number): string {
  // 1/1=1, 1/2=0.5, 1/4=0.25, 1/8=0.125, 1/16=0.0625
  if (beats >= 1) return '1n';
  if (beats >= 0.5) return '2n';
  if (beats >= 0.25) return '4n';
  if (beats >= 0.125) return '8n';
  return '16n';
}
