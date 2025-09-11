// SONA 오디오 시스템 타입 정의 (Tri Hybrid 기반)
// 지침에 따라 행성(Planet) 속성 → 오디오 파라미터 매핑을 위한 타입들입니다.

// 악기 역할 정의 - 각 행성은 하나의 역할만 가집니다
export type InstrumentRole = 'DRUM' | 'BASS' | 'CHORD' | 'MELODY' | 'ARPEGGIO' | 'PAD';

// 전역 스케일/키 정의 (항성에서 관리)
export type ScaleName = 'Major' | 'Minor' | 'Dorian' | 'Mixolydian' | 'Lydian' | 'Phrygian' | 'Locrian';
export type KeyName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// 복잡도 레벨 (1~3)
export type Complexity = 1 | 2 | 3;

// 행성 물리 속성 (확장된 파라미터 범위)
export interface PlanetPhysicalProperties {
  planetSize: number;         // 0.01 ~ 1.00 (행성의 크기)
  planetColor: number;        // 0-360 (Hue, 행성의 색상)
  planetBrightness: number;   // 0.3 ~ 5.0 (행성의 밝기/자체발광)
  distanceFromStar: number;   // 1.0 ~ 20.0 (행성과 항성계의 거리)
  orbitSpeed: number;         // 0.01 ~ 1.0 (행성의 공전 속도)
  rotationSpeed: number;      // 0.01 ~ 1.0 (행성의 자전 속도)
  inclination: number;        // -180 ~ 180 (행성의 기울기)
  eccentricity: number;       // 0.0 ~ 0.9 (행성의 이심률)
  tilt: number;              // 0.0 ~ 180.0 (행성의 기울기)
  
  // 새로운 음색/사운드 제어 파라미터
  oscillatorType: number;     // 0-7 (오실레이터 타입)
  filterResonance: number;    // 0.1 ~ 30.0 (필터 공명)
  spatialDepth: number;       // 0 ~ 100 (공간감 깊이)
  
  // 새로운 패턴/리듬 제어 파라미터  
  patternComplexity: number;  // 0 ~ 100 (패턴 복잡도)
  rhythmDensity: number;      // 0 ~ 100 (리듬 밀도)
  
  // 새로운 피치/멜로디 제어 파라미터
  melodicVariation: number;   // 0 ~ 100 (멜로디 변화)
}

// 패턴 파라미터 (리듬/그루브)
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

// 매핑된 저수준 오디오 파라미터 묶음 (확장된 시스템)
export interface MappedAudioParameters {
  // 오실레이터 타입 (새로운 핵심 파라미터)
  oscType: number;        // 0-7 (오실레이터 타입: sine, saw, square, etc.)
  harmonicity: number;    // 0.5-4.0 (FM/AM 하모니시티)
  
  // Color → 음색 (개선된 Tri)
  wtIndex: number;        // 0..1 (웨이브테이블 인덱스)
  toneTint: number;       // 0..1 (음색 틴트)
  waveFold: number;       // 0..0.8 (웨이브 폴딩)
  detune: number;         // -25..25 (디튠 센트)
  
  // Brightness → 필터/음량 (개선된 Tri)
  cutoffHz: number;       // 150..22000 (필터 컷오프)
  outGainDb: number;      // -8..0 (출력 게인)
  resonanceQ: number;     // 0.5..15.5 (필터 공명)
  filterResonance: number; // 0.5..15.5 (추가 공명 제어)
  
  // Distance → 공간감 (개선된 Tri)
  reverbSend: number;     // 0..0.7 (리버브 센드)
  delayTime: number;      // 0.1..1.6 (딜레이 타임)
  delayFeedback: number;  // 0..0.6 (딜레이 피드백)
  spatialWidth: number;   // 0.2..1.0 (공간 폭)
  
  // 새로운 3D 공간감 파라미터들
  panSpread: number;      // -0.6..0.6 (팬 확산)
  chorusDepth: number;    // 0..0.8 (코러스 깊이)
  binaural: number;       // 0..0.3 (바이노럴 효과)
  
  // Size + MelodicVariation → 피치/멜로디 (결합된 Dual)
  pitchSemitones: number; // -12..+12 (피치 반음)
  rangeWidth: number;     // 5..25 (음역 폭)
  intervalVariation: number; // 0..0.8 (인터벌 변화)
  scaleDeviation: number; // 0..0.3 (스케일 이탈)
  microtonality: number;  // 0..0.15 (미분음성)
  
  // OrbitSpeed + RhythmDensity → 리듬 (결합된 Dual)
  rate: string;           // Tone.js sync value
  pulses: number;         // 2..16 (펄스 개수)
  subdivision: number;    // 1-4 (세분화 레벨)
  syncopation: number;    // 0..0.8 (싱코페이션)
  ghostNotes: number;     // 0..0.4 (고스트 노트)
  
  // RotationSpeed + PatternComplexity → 모듈레이션 (결합된 Tri)
  tremHz: number;         // 0.2..12.2 (트레몰로 주파수)
  tremDepth: number;      // 0..0.7 (트레몰로 깊이)
  vibratoRate: number;    // 2..10 (비브라토 속도)
  polyrhythm: number;     // 1-4 (폴리리듬 팩터)
  patternEvolution: number; // 0..0.9 (패턴 진화)
  crossRhythm: number;    // 0..0.6 (크로스 리듬)
  
  // Eccentricity + Tilt → 그루브/공간 (개선된 Dual)
  swingPct: number;       // 0..45 (스윙 퍼센트)
  accentDb: number;       // 0..6 (액센트 dB)
  timing: number;         // -0.05..0.05 (타이밍 오프셋 초)
  pan: number;            // -0.8..0.8 (팬)
  stereoWidth: number;    // 0.1..1.5 (스테레오 폭)
  
  // 기존 호환성 유지
  reverbSize: number;     // 0.2..0.9 (리버브 크기)
  msBlend: number;        // 0.3..0.7 (MS 블렌드)
}

// 생성된 패턴 구조
export interface GeneratedPattern {
  params: PatternParameters;
  steps: number[];      // 0|1 트리거 배열
  accents: number[];    // 0|1 액센트 배열
}

// 전역 Star (항성) 상태
export interface StarGlobalState {
  bpm: number;         // 60-180 (Spin → BPM)
  volume: number;      // 0-100 (Brightness → Volume)
  key: KeyName;        // Color → Key
  scale: ScaleName;    // Color → Scale
  complexity: Complexity; // Size → Complexity (1~3 → 패턴 밀도)
}
