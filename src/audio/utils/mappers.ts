// 행성 속성 → 오디오 파라미터 매핑 (Tri Hybrid + Dual)
// 지침의 매핑 공식을 그대로 구현합니다.

import type { InstrumentRole, PlanetPhysicalProperties, MappedAudioParameters } from '../../types/audio';
import { clamp, mapLin, mapExp, curve, syncFromBeats } from './mapping';

// 역할별 가드레일 상수 정의
interface RoleGuards {
  reverbSendMax: number;
  stereoWidthMax?: number;
  cutoffMax?: number;
  tremHzMax?: number;
  gateMin?: number;
  gateMax?: number;
  swingMax?: number;
  rangeMin?: number;
  rangeMax?: number;
}

const ROLE_GUARDS: Record<InstrumentRole, RoleGuards> = {
  DRUM: { 
    reverbSendMax: 0.2 
  },
  BASS: { 
    reverbSendMax: 0.15, 
    stereoWidthMax: 0.4, 
    cutoffMax: 3000,
    rangeMin: 28,
    rangeMax: 52
  },
  CHORD: { 
    reverbSendMax: 0.4 
  },
  MELODY: { 
    reverbSendMax: 0.25,
    swingMax: 25,
    rangeMin: 55,
    rangeMax: 84
  },
  ARPEGGIO: { 
    reverbSendMax: 0.35, 
    tremHzMax: 6 
  },
  PAD: { 
    reverbSendMax: 0.6, 
    gateMin: 0.7, 
    gateMax: 0.95 
  }
};

// 정규화 헬퍼 함수들
function normalizeRange(value: number, max: number): number {
  return clamp(value / max, 0, 1);
}

function normalizeBipolar(value: number): number {
  return clamp(value / 90, -1, 1);
}

// 메인 매핑 함수
export function mapPlanetToAudio(role: InstrumentRole, props: PlanetPhysicalProperties): MappedAudioParameters {
  const guards = ROLE_GUARDS[role];
  
  // 속성 정규화 (0-1 범위로)
  const sizeN = normalizeRange(props.size, 100);
  const brightN = normalizeRange(props.brightness, 100);
  const distN = normalizeRange(props.distance, 100);
  const colorN = clamp((props.color % 360) / 360, 0, 1);
  const tiltN = (normalizeBipolar(props.tilt) + 1) / 2;         // 0..1
  const elevN = (normalizeBipolar(props.elevation) + 1) / 2;    // 0..1
  const speedN = normalizeRange(props.speed, 100);
  const spinN = normalizeRange(props.spin, 100);
  const eccN = normalizeRange(props.eccentricity, 100);
  const phaseN = clamp((props.phase % 360) / 360, 0, 1);

  // === Tri 매핑: Color ===
  const wtIndex = colorN;
  const toneTint = curve(colorN, 'sigmoid');
  const waveFold = mapLin(toneTint, 0, 0.6);

  // === Tri 매핑: Brightness ===
  let cutoffHz = mapExp(brightN, 800, 16000, 3.0);
  if (guards.cutoffMax) {
    cutoffHz = Math.min(cutoffHz, guards.cutoffMax);
  }
  const outGainDb = mapLin(brightN, -6, 0);
  const resonanceQ = clamp(
    mapLin(brightN, 0.2, 0.7) * (cutoffHz > 1200 ? 1.0 : 0.6), 
    0.2, 
    0.7
  );

  // === Tri 매핑: Distance ===
  const reverbSendRaw = curve(distN, 'exp');
  const reverbSend = Math.min(reverbSendRaw, guards.reverbSendMax);
  const delayBeats = mapLin(distN, 0.25, 1.5);
  const reverbSize = mapLin(distN, 0.2, 0.9);

  // === Tri 매핑: Tilt ===
  const pan = mapLin(tiltN, -0.6, 0.6);
  const msBlend = mapLin(tiltN, 0.3, 0.7);
  let stereoWidth = mapLin(tiltN, 0.2, 1.0);
  if (guards.stereoWidthMax) {
    stereoWidth = Math.min(stereoWidth, guards.stereoWidthMax);
  }

  // === Tri 매핑: Spin ===
  let tremHz = mapExp(spinN, 0.5, 8.0, 2.0);
  if (guards.tremHzMax) {
    tremHz = Math.min(tremHz, guards.tremHzMax);
  }
  const tremDepth = mapLin(spinN, 0.10, 0.40);
  const chorusDepth = mapLin(spinN, 0.05, 0.5);

  // === Dual 매핑: Size ===
  const pitchSemitones = mapLin(sizeN, -7, 7); // mapExp 대신 선형으로 (음수 문제 방지)
  const rangeWidth = Math.round(mapLin(Math.pow(sizeN, 0.6), 5, 19));

  // === Dual 매핑: Speed ===
  const rateBeats = mapLin(speedN, 0.125, 1); // 1/8 ~ 1/1
  const rate = syncFromBeats(rateBeats);
  const pulses = Math.round(mapExp(speedN, 2, 16, 2.0));

  // === Dual 매핑: Eccentricity ===
  let swingPct = clamp(eccN * 40, 0, 40);
  if (guards.swingMax) {
    swingPct = Math.min(swingPct, guards.swingMax);
  }
  const accentDb = mapLin(eccN, 0, 2);

  // === Dual 매핑: Elevation ===
  const octave = Math.round(mapLin(elevN, -1, 1));
  const filterMorph = mapLin(elevN, 0, 1);

  // === Dual 매핑: Phase ===
  const rotation = Math.floor(phaseN * 16);
  const accentGate = [0, 0.25, 0.5, 0.75].map(point => 
    (phaseN >= point && phaseN < point + 0.1) ? 1 : 0
  );

  return {
    // Color (Tri)
    wtIndex,
    toneTint,
    waveFold,
    
    // Brightness (Tri)
    cutoffHz,
    outGainDb,
    resonanceQ,
    
    // Distance (Tri)
    reverbSend,
    delayBeats,
    reverbSize,
    
    // Tilt (Tri)
    pan,
    msBlend,
    stereoWidth,
    
    // Spin (Tri)
    tremHz,
    tremDepth,
    chorusDepth,
    
    // Size (Dual)
    pitchSemitones,
    rangeWidth,
    
    // Speed (Dual)
    rate,
    pulses,
    
    // Eccentricity (Dual)
    swingPct,
    accentDb,
    
    // Elevation (Dual)
    octave,
    filterMorph,
    
    // Phase (Dual)
    rotation,
    accentGate
  };
}
