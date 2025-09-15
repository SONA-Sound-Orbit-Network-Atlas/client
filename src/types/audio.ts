// SONA 오디오 시스템 전용 타입 정의
// 행성 속성 관련은 planetProperties.ts에서 가져와 사용

import type { InstrumentRole } from './planetProperties';

// 악기 역할 재내보내기 (하위 호환성)
export type { InstrumentRole };

// 전역 스케일/키 정의 (항성에서 관리)
export type ScaleName = 'Major' | 'Minor' | 'Dorian' | 'Mixolydian' | 'Lydian' | 'Phrygian' | 'Locrian';
export type KeyName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// 복잡도 레벨 (1~3)
export type Complexity = 1 | 2 | 3;

// 패턴 파라미터 (리듬/그루브) - 오디오 시스템 전용
export interface PatternParameters {
  pulses: number;         // 1..16
  steps: number;          // 기본 16
  rotation: number;       // 0..15
  swingPct: number;       // 0..40
  accentDb: number;       // 0..2
  gateLen: number;        // 0.35..0.85
  barsBetweenReroll?: number; // 패턴 재생성 주기 (4..16)
  phase?: number;         // 0..360 (Phase 속성)
  eccentricity?: number;  // 0..100 (Eccentricity 속성)
}

// 매핑된 저수준 오디오 파라미터 묶음 - 오디오 시스템 전용
export interface MappedAudioParameters {
  // 오실레이터 타입
  oscType: number;        // 0-7 (오실레이터 타입: sine, saw, square, etc.)
  harmonicity: number;    // 0.5-4.0 (FM/AM 하모니시티)
  
  // Color → 음색
  wtIndex: number;        // 0..1 (웨이브테이블 인덱스)
  toneTint: number;       // 0..1 (음색 틴트)
  waveFold: number;       // 0..0.8 (웨이브 폴딩)
  detune: number;         // -25..25 (디튠 센트)
  
  // Brightness → 필터/음량
  cutoffHz: number;       // 150..22000 (필터 컷오프)
  outGainDb: number;      // -8..0 (출력 게인)
  resonanceQ: number;     // 0.5..15.5 (필터 공명)
  filterResonance: number; // 0.5..15.5 (추가 공명 제어)
  
  // Distance → 공간감
  reverbSend: number;     // 0..0.7 (리버브 센드)
  delayTime: number;      // 0.1..1.6 (딜레이 타임)
  delayFeedback: number;  // 0..0.6 (딜레이 피드백)
  spatialWidth: number;   // 0.2..1.0 (공간 폭)
  
  // 3D 공간감 파라미터들
  panSpread: number;      // -0.6..0.6 (팬 확산)
  chorusDepth: number;    // 0..0.8 (코러스 깊이)
  binaural: number;       // 0..0.3 (바이노럴 효과)
  
  // Size + MelodicVariation → 피치/멜로디
  pitchSemitones: number; // -12..+12 (피치 반음)
  rangeWidth: number;     // 5..25 (음역 폭)
  intervalVariation: number; // 0..0.8 (인터벌 변화)
  scaleDeviation: number; // 0..0.3 (스케일 이탈)
  microtonality: number;  // 0..0.15 (미분음성)
  
  // OrbitSpeed + RhythmDensity → 리듬
  rate: string;           // Tone.js sync value
  pulses: number;         // 2..16 (펄스 개수)
  subdivision: number;    // 1-4 (세분화 레벨)
  syncopation: number;    // 0..0.8 (싱코페이션)
  ghostNotes: number;     // 0..0.4 (고스트 노트)
  
  // RotationSpeed + PatternComplexity → 모듈레이션
  tremHz: number;         // 0.2..12.2 (트레몰로 주파수)
  tremDepth: number;      // 0..0.7 (트레몰로 깊이)
  vibratoRate: number;    // 2..10 (비브라토 속도)
  polyrhythm: number;     // 1-4 (폴리리듬 팩터)
  patternEvolution: number; // 0..0.9 (패턴 진화)
  crossRhythm: number;    // 0..0.6 (크로스 리듬)
  
  // Eccentricity + Tilt → 그루브/공간
  swingPct: number;       // 0..45 (스윙 퍼센트)
  accentDb: number;       // 0..6 (액센트 dB)
  timing: number;         // -0.05..0.05 (타이밍 오프셋 초)
  pan: number;            // -0.8..0.8 (팬)
  stereoWidth: number;    // 0.1..1.5 (스테레오 폭)
  
  // 기존 호환성 유지
  reverbSize: number;     // 0.2..0.9 (리버브 크기)
  msBlend: number;        // 0.3..0.7 (MS 블렌드)
}

// 생성된 패턴 구조 - 오디오 시스템 전용
export interface GeneratedPattern {
  params: PatternParameters;
  steps: number[];      // 0|1 트리거 배열
  accents: number[];    // 0|1 액센트 배열
}

// 전역 Star (항성) 상태 - 오디오 시스템 전용
export interface StarGlobalState {
  bpm: number;         // 60-180 (Spin → BPM)
  volume: number;      // 0-100 (Brightness → Volume)
  key: KeyName;        // Color → Key
  scale: ScaleName;    // Color → Scale
  complexity: Complexity; // Size → Complexity (1~3 → 패턴 밀도)
}
