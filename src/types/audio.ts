// SONA 오디오 시스템 타입 정의 (Tri Hybrid 기반)
// 지침에 따라 행성(Planet) 속성 → 오디오 파라미터 매핑을 위한 타입들입니다.

// 악기 역할 정의 - 각 행성은 하나의 역할만 가집니다
export type InstrumentRole = 'DRUM' | 'BASS' | 'CHORD' | 'MELODY' | 'ARPEGGIO' | 'PAD';

// 전역 스케일/키 정의 (항성에서 관리)
export type ScaleName = 'Major' | 'Minor' | 'Dorian' | 'Mixolydian' | 'Lydian' | 'Phrygian' | 'Locrian';
export type KeyName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// 복잡도 레벨 (1~3)
export type Complexity = 1 | 2 | 3;

// 행성 물리 속성 (원본 단위 그대로 입력, 내부에서 정규화)
export interface PlanetPhysicalProperties {
  size: number;         // 0-100
  brightness: number;   // 0-100
  distance: number;     // 0-100
  color: number;        // 0-360 (Hue)
  tilt: number;         // -90 ~ 90 (deg)
  elevation: number;    // -90 ~ 90 (deg)
  speed: number;        // 0-100
  spin: number;         // 0-100
  eccentricity: number; // 0-100
  phase: number;        // 0-360 (deg)
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

// 매핑된 저수준 오디오 파라미터 묶음 (Tri Hybrid + Dual)
export interface MappedAudioParameters {
  // Color (Tri) → 음색
  wtIndex: number;        // 0..1 (osc.wt_index)
  toneTint: number;       // 0..1 (osc.tone_tint)
  waveFold: number;       // 0..0.6 (osc.wavefold_amount)
  
  // Brightness (Tri) → 필터/음량
  cutoffHz: number;       // 800..16000 (filter.cutoff_hz)
  outGainDb: number;      // -6..0 (mix.out_gain_db)
  resonanceQ: number;     // 0.2..0.7 (filter.resonance)
  
  // Distance (Tri) → 공간감
  reverbSend: number;     // 0..1 (fx.reverb_send, 역할별 클램프)
  delayBeats: number;     // 0.25..1.5 (fx.delay_beats)
  reverbSize: number;     // 0.2..0.9 (fx.reverb_size)
  
  // Tilt (Tri) → 스테레오
  pan: number;            // -0.6..0.6 (mix.pan)
  msBlend: number;        // 0.3..0.7 (mix.ms_blend)
  stereoWidth: number;    // 0.2..1.0 (mix.stereo_width, BASS ≤ 0.4)
  
  // Spin (Tri) → 모듈레이션
  tremHz: number;         // 0.5..8 (mod.trem_hz)
  tremDepth: number;      // 0.10..0.40 (mod.trem_depth)
  chorusDepth: number;    // 0.05..0.5 (mod.chorus_depth)
  
  // Size (Dual) → 피치/범위
  pitchSemitones: number; // -7..+7 (pitch.semitones)
  rangeWidth: number;     // 5..19 (range.widthSemi)
  
  // Speed (Dual) → 리듬
  rate: string;           // Tone.js sync value (e.g. '4n')
  pulses: number;         // 2..16 (seq.pulses)
  
  // Eccentricity (Dual) → 그루브
  swingPct: number;       // 0..40 (groove.swing_pct)
  accentDb: number;       // 0..2 (groove.accent_db)
  
  // Elevation (Dual) → 음높이/필터타입
  octave: number;         // -1..+1 (pitch.octave)
  filterMorph: number;    // 0..1 (filter.type_morph, LP→BP→HP)
  
  // Phase (Dual) → 시퀀스
  rotation: number;       // 0..15 (seq.rotation)
  accentGate: number[];   // accent_gate (@quarters)
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
