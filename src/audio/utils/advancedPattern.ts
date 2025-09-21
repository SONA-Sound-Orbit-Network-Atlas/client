// 고급 패턴 생성 알고리즘 - SONA 시스템 최적화
// Euclidean + Weighted + Musical Intelligence 기반 패턴 생성

import type { InstrumentRole, PatternParameters, GeneratedPattern } from '../../types/audio';
import { clamp } from './parameterConfig';
import { RandomManager } from './random';
import type { IRandomSource } from '../interfaces/IRandomSource';
import { 
  enhancePatternMusically, 
  generateMarkovPattern, 
  calculateMusicalQuality 
} from './musicalRules';

// 역할별 패턴 특성 정의
interface RoleCharacteristics {
  preferredPulses: [number, number];  // [min, max] 선호 펄스 개수
  accentStrength: number;             // 액센트 강도 (0-1)
  syncopationTendency: number;        // 싱코페이션 경향 (0-1)
  restImportance: number;             // 쉼표의 중요도 (0-1)
  polyrhythmicFactor: number;         // 폴리리듬 계수 (1이 기본)
}

const ROLE_CHARACTERISTICS: Record<InstrumentRole, RoleCharacteristics> = {
  'BASS': {
    preferredPulses: [2, 8],
    accentStrength: 0.8,
    syncopationTendency: 0.3,
    restImportance: 0.6,
    polyrhythmicFactor: 1.0
  },
  'DRUM': {
    preferredPulses: [4, 12],
    accentStrength: 0.9,
    syncopationTendency: 0.2,
    restImportance: 0.4,
    polyrhythmicFactor: 1.0
  },
  'CHORD': {
    preferredPulses: [2, 6],
    accentStrength: 0.6,
    syncopationTendency: 0.4,
    restImportance: 0.7,
    polyrhythmicFactor: 1.0
  },
  'MELODY': {
    preferredPulses: [4, 14],
    accentStrength: 0.7,
    syncopationTendency: 0.6,
    restImportance: 0.5,
    polyrhythmicFactor: 1.0
  },
  'ARPEGGIO': {
    preferredPulses: [6, 16],
    accentStrength: 0.5,
    syncopationTendency: 0.7,
    restImportance: 0.3,
    polyrhythmicFactor: 1.5
  },
  'PAD': {
    preferredPulses: [1, 4],
    accentStrength: 0.4,
    syncopationTendency: 0.1,
    restImportance: 0.8,
    polyrhythmicFactor: 0.5
  }
};

// 고급 Euclidean 알고리즘 (Bjorklund 알고리즘의 정확한 구현)
export function advancedEuclideanRhythm(pulses: number, steps: number): number[] {
  if (pulses >= steps) {
    return new Array(steps).fill(1);
  }
  if (pulses === 0) {
    return new Array(steps).fill(0);
  }
  
  // Bjorklund 알고리즘 구현
  const pattern = new Array(steps).fill(0);
  const counts = new Array(steps).fill(0);
  const remainders = new Array(steps).fill(0);
  
  let divisor = steps - pulses;
  remainders[0] = pulses;
  let level = 0;
  
  do {
    counts[level] = Math.floor(divisor / remainders[level]);
    remainders[level + 1] = divisor % remainders[level];
    divisor = remainders[level];
    level++;
  } while (remainders[level] > 1);
  
  counts[level] = divisor;
  
  // 패턴 구성
  let index = 0;
  for (let i = 0; i < level; i++) {
    for (let j = 0; j < counts[i]; j++) {
      pattern[index] = 1;
      index++;
      for (let k = 0; k < remainders[i]; k++) {
        pattern[index] = 0;
        index++;
      }
    }
  }
  
  for (let i = 0; i < counts[level]; i++) {
    pattern[index] = 1;
    index++;
  }
  
  return pattern;
}

// 역할별 가중치 패턴 생성 (음악적 지능 추가)
function generateWeightedPattern(
  role: InstrumentRole, 
  pulses: number, 
  steps: number, 
  complexity: number,
  rng: IRandomSource
): number[] {
  const chars = ROLE_CHARACTERISTICS[role];
  
  // 복잡도에 따른 펄스 조정
  const adjustedPulses = clamp(
    Math.round(pulses * (1 + 0.2 * (complexity - 1))),
    chars.preferredPulses[0],
    Math.min(chars.preferredPulses[1], steps)
  );
  
  // Euclidean과 Markov 패턴을 혼합하여 더 음악적인 결과 생성
  const targetDensity = adjustedPulses / steps;
  
  // 50% 확률로 Euclidean 또는 Markov 패턴 선택
  let pattern: number[];
  if (rng.nextFloat() < 0.5) {
    // 기본 Euclidean 패턴 생성
    pattern = advancedEuclideanRhythm(adjustedPulses, steps);
  } else {
    // Markov 체인 패턴 생성 (더 자연스러운 플로우)
    pattern = generateMarkovPattern(steps, targetDensity, role, rng);
  }
  
  // 음악적 규칙 적용으로 패턴 개선
  pattern = enhancePatternMusically(pattern, role, rng);
  
  return pattern;
}

// 고급 액센트 패턴 생성 (Phase + Eccentricity 기반)
function generateAdvancedAccents(
  steps: number[], 
  phase: number, 
  eccentricity: number,
  role: InstrumentRole,
  rng: IRandomSource
): number[] {
  const accents = new Array(steps.length).fill(0);
  const chars = ROLE_CHARACTERISTICS[role];
  
  // Phase 기반 회전된 액센트 위치
  const phaseOffset = Math.floor((phase / 360) * steps.length);
  const baseAccentPositions = [0, 4, 8, 12]; // 기본 강박 위치
  
  baseAccentPositions.forEach(pos => {
    const rotatedPos = (pos + phaseOffset) % steps.length;
    if (rotatedPos < steps.length && steps[rotatedPos] === 1) {
      accents[rotatedPos] = 1;
    }
  });
  
  // Eccentricity 기반 추가 액센트
  const additionalAccentProbability = (eccentricity / 100) * chars.accentStrength;
  
  for (let i = 0; i < steps.length; i++) {
    if (steps[i] === 1 && accents[i] === 0 && rng.nextFloat() < additionalAccentProbability) {
      accents[i] = 1;
    }
  }
  
  return accents;
}

// 패턴 회전 (개선된 알고리즘)
export function rotatePattern(pattern: number[], rotation: number): number[] {
  const steps = pattern.length;
  const normalizedRotation = ((rotation % steps) + steps) % steps;
  
  return [
    ...pattern.slice(normalizedRotation),
    ...pattern.slice(0, normalizedRotation)
  ];
}

// 메인 고급 패턴 생성 함수
export function generateAdvancedPattern(
  params: PatternParameters,
  role: InstrumentRole,
  globalComplexity: number = 2,
  rng: IRandomSource = RandomManager.instance
): GeneratedPattern {
  // 역할별 특성 가져오기
  const characteristics = ROLE_CHARACTERISTICS[role];
  
  // 가중치 기반 패턴 생성
  let steps = generateWeightedPattern(role, params.pulses, params.steps, globalComplexity, rng);
  
  // 회전 적용
  steps = rotatePattern(steps, params.rotation);
  
  // 고급 액센트 생성
  const accents = generateAdvancedAccents(
    steps, 
    params.phase || 0, 
    params.eccentricity || 0,
    role,
    rng
  );
  
  // 최종 파라미터 (역할별 가드레일 적용)
  const finalParams = applyRoleGuardrails(params, role);
  // 보조 정보(생성된 패턴 기반)를 finalParams에 병합하여 반환
  const derived = {
    pulses: steps.filter(x => x === 1).length,
    steps: steps.length,
    accents: accents.filter(x => x === 1).length,
    characteristics: characteristics
  };

  // PatternParameters 타입과 충돌하지 않는 추가 정보를 포함시키기 위해
  // finalParams을 복사하고 필요한 필드를 덧붙입니다.
  const mergedParams = {
    ...finalParams,
    // 아래 필드들은 GeneratedPattern.params에서 유용하므로 포함시킵니다.
    generatedPulses: derived.pulses,
    generatedSteps: derived.steps,
    generatedAccents: derived.accents,
    characteristics: derived.characteristics
  } as unknown as PatternParameters;

  return {
    params: mergedParams,
    steps,
    accents
  };
}

// 역할별 가드레일 적용 (SONA 지침 준수)
function applyRoleGuardrails(params: PatternParameters, role: InstrumentRole): PatternParameters {
  const result = { ...params };
  
  switch (role) {
    case 'MELODY':
      // LEAD: swing ≤ 25%
      result.swingPct = Math.min(25, result.swingPct);
      break;
      
    case 'ARPEGGIO':
      // ARP: pulses 6-16, rotation 2배수
      result.pulses = Math.max(6, Math.min(16, result.pulses));
      result.rotation = Math.round(result.rotation / 2) * 2;
      break;
      
    case 'PAD':
      // PAD: pulses 2-6, gate 0.70-0.95
      result.pulses = Math.max(2, Math.min(6, result.pulses));
      result.gateLen = Math.max(0.70, Math.min(0.95, result.gateLen));
      break;
      
    case 'BASS':
      // BASS: 안정적인 패턴
      result.pulses = Math.max(2, Math.min(8, result.pulses));
      break;
  }
  
  return result;
}

// 패턴 품질 평가 (음악적 품질 점수)
export function evaluatePatternQuality(pattern: GeneratedPattern, role: InstrumentRole): number {
  const { steps } = pattern;
  
  // 새로운 음악적 품질 계산 사용
  const musicalQuality = calculateMusicalQuality(steps, role);
  
  let score = musicalQuality; // 기본 점수는 음악적 품질
  
  // 기존 평가 요소들을 보조 점수로 활용
  
  // 1. 밀도 점수 (역할별 선호 밀도와의 일치도)
  const characteristics = ROLE_CHARACTERISTICS[role];
  const density = steps.filter(x => x === 1).length / steps.length;
  const idealDensity = (characteristics.preferredPulses[0] + characteristics.preferredPulses[1]) / (2 * steps.length);
  const densityScore = 1 - Math.abs(density - idealDensity);
  score += densityScore * 0.1; // 보조 점수로 가중치 감소
  
  // 2. 리듬적 일관성 점수
  const rhythmScore = calculateRhythmConsistency(steps);
  score += rhythmScore * 0.1;
  
  // 3. 액센트 분포 점수
  const accentScore = calculateAccentDistribution(pattern.accents);
  score += accentScore * 0.1;
  
  return clamp(score, 0, 1);
}

// 리듬적 일관성 계산
function calculateRhythmConsistency(steps: number[]): number {
  // 연속된 노트와 쉼표의 분포를 평가
  let consecutiveNotes = 0;
  let consecutiveRests = 0;
  let maxConsecutive = 0;
  
  for (let i = 0; i < steps.length; i++) {
    if (steps[i] === 1) {
      consecutiveNotes++;
      consecutiveRests = 0;
    } else {
      consecutiveRests++;
      consecutiveNotes = 0;
    }
    maxConsecutive = Math.max(maxConsecutive, consecutiveNotes, consecutiveRests);
  }
  
  // 너무 긴 연속은 점수 감점
  return Math.max(0, 1 - (maxConsecutive - 4) / 8);
}

// 액센트 분포 계산
function calculateAccentDistribution(accents: number[]): number {
  const accentCount = accents.filter(x => x === 1).length;
  const totalSteps = accents.length;
  
  // 적절한 액센트 비율 (10-30%)
  const accentRatio = accentCount / totalSteps;
  const idealRatio = 0.2;
  
  return Math.max(0, 1 - Math.abs(accentRatio - idealRatio) / idealRatio);
}
