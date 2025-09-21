// 음악적 규칙 시스템 - 역할별 리듬 패턴의 음악적 타당성을 보장
// 음악 이론에 기반한 금지/선호 스텝, Markov 전이 확률 등을 정의

import type { InstrumentRole } from '../../types/audio';
import type { IRandomSource } from '../interfaces/IRandomSource';

// 리듬 스텝 상태 (16분음표 기준)
export type RhythmStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

// 음악적 중요도 (강박/약박 분류)
export const BeatImportance = {
  DOWNBEAT: 'downbeat',      // 1박 (가장 강함)
  STRONG: 'strong',          // 3박 (강함)  
  WEAK: 'weak',              // 2박, 4박 (중간)
  OFFBEAT: 'offbeat'         // 8분음표 싱코페이션 위치
} as const;

export type BeatImportanceType = typeof BeatImportance[keyof typeof BeatImportance];

// 역할별 리듬 규칙
interface RhythmRule {
  // 금지된 스텝들 (음악적으로 부자연스러운 위치)
  forbiddenSteps: RhythmStep[];
  
  // 선호 스텝들 (해당 역할에 자연스러운 위치)
  preferredSteps: RhythmStep[];
  
  // 연속 노트 제한 (max consecutive notes)
  maxConsecutiveNotes: number;
  
  // 연속 쉼표 제한 (max consecutive rests)
  maxConsecutiveRests: number;
  
  // 싱코페이션 허용도 (0-1)
  syncopationTolerance: number;
  
  // 백비트 강조 여부
  emphasizeBackbeat: boolean;
}

// 16분음표 박자 분류 맵
const BEAT_IMPORTANCE_MAP: Record<RhythmStep, BeatImportanceType> = {
  0: BeatImportance.DOWNBEAT,  // 1박
  1: BeatImportance.OFFBEAT,   // 1박 뒤 16분음표
  2: BeatImportance.OFFBEAT,   // 1박 뒤 8분음표
  3: BeatImportance.OFFBEAT,   // 1박 뒤 8분음표+16분음표
  4: BeatImportance.WEAK,      // 2박
  5: BeatImportance.OFFBEAT,   // 2박 뒤 16분음표
  6: BeatImportance.OFFBEAT,   // 2박 뒤 8분음표
  7: BeatImportance.OFFBEAT,   // 2박 뒤 8분음표+16분음표
  8: BeatImportance.STRONG,    // 3박
  9: BeatImportance.OFFBEAT,   // 3박 뒤 16분음표
  10: BeatImportance.OFFBEAT,  // 3박 뒤 8분음표
  11: BeatImportance.OFFBEAT,  // 3박 뒤 8분음표+16분음표
  12: BeatImportance.WEAK,     // 4박
  13: BeatImportance.OFFBEAT,  // 4박 뒤 16분음표
  14: BeatImportance.OFFBEAT,  // 4박 뒤 8분음표
  15: BeatImportance.OFFBEAT   // 4박 뒤 8분음표+16분음표
};

// 역할별 음악적 규칙 정의
export const MUSICAL_RULES: Record<InstrumentRole, RhythmRule> = {
  'BASS': {
    forbiddenSteps: [1, 3, 5, 7, 9, 11, 13, 15], // 16분음표 싱코페이션 금지
    preferredSteps: [0, 4, 8, 12], // 강박 위주
    maxConsecutiveNotes: 4,
    maxConsecutiveRests: 8,
    syncopationTolerance: 0.2,
    emphasizeBackbeat: false
  },
  
  'DRUM': {
    forbiddenSteps: [], // 드럼은 자유로움
    preferredSteps: [0, 4, 8, 12], // 백비트 + 강박
    maxConsecutiveNotes: 8,
    maxConsecutiveRests: 4,
    syncopationTolerance: 0.3,
    emphasizeBackbeat: true
  },
  
  'CHORD': {
    forbiddenSteps: [1, 3, 5, 7, 9, 11, 13, 15], // 복잡한 싱코페이션 지양
    preferredSteps: [0, 2, 4, 6, 8, 10, 12, 14], // 8분음표 기준
    maxConsecutiveNotes: 6,
    maxConsecutiveRests: 6,
    syncopationTolerance: 0.3,
    emphasizeBackbeat: false
  },
  
  'MELODY': {
    forbiddenSteps: [], // 멜로디는 자유로운 리듬
    preferredSteps: [0, 2, 4, 6, 8, 10, 12, 14], // 8분음표 기준이지만 유연
    maxConsecutiveNotes: 12,
    maxConsecutiveRests: 4,
    syncopationTolerance: 0.7,
    emphasizeBackbeat: false
  },
  
  'ARPEGGIO': {
    forbiddenSteps: [], // 아르페지오는 연속성 중시
    preferredSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // 모든 16분음표
    maxConsecutiveNotes: 16,
    maxConsecutiveRests: 2,
    syncopationTolerance: 0.5,
    emphasizeBackbeat: false
  },
  
  'PAD': {
    forbiddenSteps: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15], // 4분음표만
    preferredSteps: [0, 4, 8, 12], // 4분음표 강박
    maxConsecutiveNotes: 16, // 긴 지속음
    maxConsecutiveRests: 12,
    syncopationTolerance: 0.1,
    emphasizeBackbeat: false
  }
};

// Markov 전이 확률 매트릭스 (현재 상태 → 다음 상태)
// 0 = 쉼표, 1 = 노트
interface MarkovTransition {
  restToRest: number;    // 쉬다가 → 쉬기
  restToNote: number;    // 쉬다가 → 치기
  noteToRest: number;    // 치다가 → 쉬기  
  noteToNote: number;    // 치다가 → 치기
}

// 역할별 Markov 전이 확률 (음악적 플로우 제어)
const MARKOV_TRANSITIONS: Record<InstrumentRole, MarkovTransition> = {
  'BASS': {
    restToRest: 0.6,   // 쉼표 후 쉼표 (안정감)
    restToNote: 0.4,
    noteToRest: 0.5,   // 노트 후 쉼표 (숨 쉬기)
    noteToNote: 0.5
  },
  
  'DRUM': {
    restToRest: 0.3,   // 드럼은 활발함
    restToNote: 0.7,
    noteToRest: 0.4,
    noteToNote: 0.6
  },
  
  'CHORD': {
    restToRest: 0.7,   // 화음은 여유 있게
    restToNote: 0.3,
    noteToRest: 0.6,
    noteToNote: 0.4
  },
  
  'MELODY': {
    restToRest: 0.4,   // 멜로디는 균형
    restToNote: 0.6,
    noteToRest: 0.5,
    noteToNote: 0.5
  },
  
  'ARPEGGIO': {
    restToRest: 0.2,   // 아르페지오는 연속성
    restToNote: 0.8,
    noteToRest: 0.3,
    noteToNote: 0.7
  },
  
  'PAD': {
    restToRest: 0.8,   // 패드는 대부분 지속
    restToNote: 0.2,
    noteToRest: 0.1,
    noteToNote: 0.9
  }
};

// 음악적 규칙을 적용하여 패턴 보정
export function applyMusicalRules(
  pattern: number[],
  role: InstrumentRole,
  rng: IRandomSource
): number[] {
  const rule = MUSICAL_RULES[role];
  const result = [...pattern];
  
  // 1. 금지된 스텝 제거
  rule.forbiddenSteps.forEach(step => {
    if (step < result.length) {
      result[step] = 0;
    }
  });
  
  // 2. 연속 노트/쉼표 제한 적용
  result.forEach((_, index) => {
    if (index > 0) {
      // 연속 노트 체크
      let consecutiveNotes = 0;
      for (let i = index; i >= 0 && result[i] === 1; i--) {
        consecutiveNotes++;
      }
      if (consecutiveNotes > rule.maxConsecutiveNotes) {
        result[index] = 0;
      }
      
      // 연속 쉼표 체크
      let consecutiveRests = 0;
      for (let i = index; i >= 0 && result[i] === 0; i--) {
        consecutiveRests++;
      }
      if (consecutiveRests > rule.maxConsecutiveRests && rng.nextFloat() < 0.6) {
        result[index] = 1;
      }
    }
  });
  
  // 3. 선호 스텝 강화
  rule.preferredSteps.forEach(step => {
    if (step < result.length && rng.nextFloat() < 0.4) {
      result[step] = 1;
    }
  });
  
  // 4. 백비트 강조 (드럼)
  if (rule.emphasizeBackbeat) {
    [4, 12].forEach(step => { // 2박, 4박
      if (step < result.length && rng.nextFloat() < 0.8) {
        result[step] = 1;
      }
    });
  }
  
  return result;
}

// Markov 전이 확률을 사용한 패턴 생성
export function generateMarkovPattern(
  steps: number,
  density: number, // 0-1 (목표 밀도)
  role: InstrumentRole,
  rng: IRandomSource
): number[] {
  const transition = MARKOV_TRANSITIONS[role];
  const pattern = new Array(steps).fill(0);
  
  // 시작 상태 결정 (역할별 선호에 따라)
  let currentState = rng.nextFloat() < density ? 1 : 0;
  pattern[0] = currentState;
  
  // Markov 체인으로 다음 상태들 생성
  for (let i = 1; i < steps; i++) {
    const rand = rng.nextFloat();
    
    if (currentState === 0) { // 현재 쉬고 있음
      currentState = rand < transition.restToNote ? 1 : 0;
    } else { // 현재 치고 있음
      currentState = rand < transition.noteToNote ? 1 : 0;
    }
    
    pattern[i] = currentState;
  }
  
  return pattern;
}

// 싱코페이션 적용 (음악적 지능)
export function applySyncopation(
  pattern: number[],
  role: InstrumentRole,
  rng: IRandomSource
): number[] {
  const rule = MUSICAL_RULES[role];
  const result = [...pattern];
  
  // 싱코페이션 허용도에 따라 강박 → 약박 이동
  for (let i = 0; i < result.length - 1; i++) {
    const beatImportance = BEAT_IMPORTANCE_MAP[i as RhythmStep];
    
    // 강박에서 노트가 있고, 다음이 오프비트이며, 싱코페이션 허용도 범위 내
    if (
      result[i] === 1 &&
      beatImportance === BeatImportance.DOWNBEAT &&
      BEAT_IMPORTANCE_MAP[(i + 1) as RhythmStep] === BeatImportance.OFFBEAT &&
      rng.nextFloat() < rule.syncopationTolerance
    ) {
      result[i] = 0;     // 강박 제거
      result[i + 1] = 1; // 오프비트로 이동
    }
  }
  
  return result;
}

// 음악적 품질 점수 계산 (개선된 버전)
export function calculateMusicalQuality(
  pattern: number[],
  role: InstrumentRole
): number {
  const rule = MUSICAL_RULES[role];
  let score = 1.0;
  
  // 1. 금지된 스텝 사용 시 감점
  rule.forbiddenSteps.forEach(step => {
    if (step < pattern.length && pattern[step] === 1) {
      score -= 0.1;
    }
  });
  
  // 2. 선호 스텝 사용 시 가점
  const preferredHits = rule.preferredSteps.filter(step => 
    step < pattern.length && pattern[step] === 1
  ).length;
  score += (preferredHits / rule.preferredSteps.length) * 0.2;
  
  // 3. 연속성 체크
  let maxConsecutiveNotes = 0;
  let maxConsecutiveRests = 0;
  let currentStreak = 0;
  let currentType = -1;
  
  pattern.forEach(step => {
    if (step === currentType) {
      currentStreak++;
    } else {
      if (currentType === 1) maxConsecutiveNotes = Math.max(maxConsecutiveNotes, currentStreak);
      if (currentType === 0) maxConsecutiveRests = Math.max(maxConsecutiveRests, currentStreak);
      currentStreak = 1;
      currentType = step;
    }
  });
  
  // 연속성 규칙 위반 시 감점
  if (maxConsecutiveNotes > rule.maxConsecutiveNotes) {
    score -= 0.2;
  }
  if (maxConsecutiveRests > rule.maxConsecutiveRests) {
    score -= 0.15;
  }
  
  // 4. 역할별 특수 규칙
  if (rule.emphasizeBackbeat) {
    // 백비트 강조 점수 (2박, 4박)
    const backbeatScore = ([4, 12].filter(step => 
      step < pattern.length && pattern[step] === 1
    ).length / 2);
    score += backbeatScore * 0.15;
  }
  
  return Math.max(0, Math.min(1, score));
}

// 통합 음악적 패턴 개선 함수
export function enhancePatternMusically(
  basePattern: number[],
  role: InstrumentRole,
  rng: IRandomSource
): number[] {
  let enhanced = [...basePattern];
  
  // 1. 음악적 규칙 적용
  enhanced = applyMusicalRules(enhanced, role, rng);
  
  // 2. 싱코페이션 적용
  enhanced = applySyncopation(enhanced, role, rng);
  
  // 3. 최종 품질 검증 (계산은 내부 검증용으로 유지되나 출력은 생략)
  calculateMusicalQuality(enhanced, role);
  
  return enhanced;
}
