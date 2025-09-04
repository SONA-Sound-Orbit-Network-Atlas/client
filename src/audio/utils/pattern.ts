// 패턴 생성 유틸리티 - Euclidean 기반 리듬 패턴
// 지침에 따라 Speed, Phase, Eccentricity 속성으로 패턴을 생성합니다.

import type { GeneratedPattern, PatternParameters } from '../../types/audio';
import { clamp } from './mapping';

// Euclidean 리듬 알고리즘 (Bjorklund 알고리즘 간단 구현)
function euclideanRhythm(pulses: number, steps: number): number[] {
  const pattern = new Array(steps).fill(0);
  
  // 펄스를 스텝 전체에 균등하게 분배
  for (let i = 0; i < pulses; i++) {
    const index = Math.floor((i * steps) / pulses);
    pattern[index] = 1;
  }
  
  return pattern;
}

// 패턴을 회전시키는 함수
export function rotatePattern(arr: number[], rotation: number): number[] {
  const n = arr.length;
  const r = ((rotation % n) + n) % n;
  return arr.slice(r).concat(arr.slice(0, r));
}

// 액센트 패턴 생성 (Phase 속성 기반)
function generateAccents(steps: number[], phase: number): number[] {
  const accents = new Array(steps.length).fill(0);
  
  // 첫 번째 스텝은 항상 액센트
  if (steps[0] === 1) accents[0] = 1;
  
  // Phase 값에 따라 추가 액센트 위치 결정
  // phase를 0-1로 정규화하여 quarter 지점들에 액센트 배치
  const phaseNorm = (phase % 360) / 360;
  const quarterPoints = [0.25, 0.5, 0.75];
  
  quarterPoints.forEach(point => {
    if (phaseNorm >= point && phaseNorm < point + 0.1) {
      const index = Math.floor(point * steps.length);
      if (index < steps.length && steps[index] === 1) {
        accents[index] = 1;
      }
    }
  });
  
  // 4박자마다 액센트 추가 (기본 패턴)
  for (let i = 0; i < steps.length; i += 4) {
    if (i < steps.length && steps[i] === 1) {
      accents[i] = 1;
    }
  }
  
  return accents;
}

// 메인 패턴 생성 함수
export function generatePattern(params: PatternParameters): GeneratedPattern {
  // pulses를 steps 범위로 제한
  const clampedPulses = clamp(params.pulses, 1, params.steps);
  
  // Euclidean 패턴 생성
  let steps = euclideanRhythm(clampedPulses, params.steps);
  
  // 회전 적용
  steps = rotatePattern(steps, params.rotation);
  
  // 액센트 패턴 생성 (phase 속성 활용)
  const accents = generateAccents(steps, 0); // phase는 추후 매핑에서 전달
  
  return {
    params: { ...params, pulses: clampedPulses },
    steps,
    accents
  };
}
