import { PLANET_PROPERTIES } from '../../types/planetProperties';
import type { PlanetProperties } from '../../types/planetProperties';
import type { InstrumentRole } from '../../types/audio';

// 행성 프로퍼티 값을 오디오 파라미터에 0~100 스케일로 변환하는 함수
function mapToAudioScale(key: string, value: number): number {
  const def = PLANET_PROPERTIES[key];
  if (!def) return 0;
  // value가 min이면 0, max면 100, 그 사이는 선형적으로 변환
  return ((value - def.min) / (def.max - def.min)) * 100;
}

// 이전에 types 파일에 있던 transform 로직을 audio 레이어로 이동했습니다.
// 이 파일은 행성의 raw 속성(숫자값)을 받아 각 audio target에 대한 물리 단위 값을 반환합니다.

export function mapPlanetToAudioTargets(
  properties: PlanetProperties,
  role?: InstrumentRole
): Record<string, number> {
  const result: Record<string, number> = {};

  // helper: get audio-scaled value (0~100)
  const getAudioValue = (key: string) => mapToAudioScale(key, (properties as Record<string, number>)[key]);

  // planetSize: 0~100 스케일로 변환
  if (properties.planetSize !== undefined) {
    const v = getAudioValue('planetSize'); // 0~100
    // pitchSemitones: -12~+12로 매핑
    result['pitchSemitones'] = (v / 100 - 0.5) * 24;
    // rangeWidth: 5~25로 매핑
    result['rangeWidth'] = Math.round(5 + Math.pow(v / 100, 0.8) * 20);
  }

  // planetColor: 0~100 스케일로 변환
  if (properties.planetColor !== undefined) {
    const v = getAudioValue('planetColor');
    // toneTint: sigmoid curve (0~1)
    result['toneTint'] = 1 / (1 + Math.exp(-6 * (v / 100 - 0.5)));
    // wavefoldAmount: 0~0.8
    result['wavefoldAmount'] = (v / 100) * 0.8;
    // detune: -25~+25
    result['detune'] = (v / 100 - 0.5) * 50;
  }

  // planetBrightness: 0~100 스케일로 변환
  if (properties.planetBrightness !== undefined) {
    const v = getAudioValue('planetBrightness');
    // filterCutoff: 150~22000Hz (지각적 곡선)
    result['filterCutoff'] = 150 + Math.pow(v / 100, 2.8) * (22000 - 150);
    // filterResonance: 0.5~15.5
    result['filterResonance'] = 0.5 + Math.pow(v / 100, 1.5) * 15;
    // outputGain: -8~0dB
    result['outputGain'] = -8 + (v / 100) * 8;
  }

  // distanceFromStar: 0~100 스케일로 변환
  if (properties.distanceFromStar !== undefined) {
    const v = getAudioValue('distanceFromStar');
    // reverbSend: 0~0.7 (지각적 곡선)
    result['reverbSend'] = Math.pow(v / 100, 1.8) * 0.7;
    // delayFeedback: 0~0.6
    result['delayFeedback'] = (v / 100) * 0.6;
    // spatialWidth: 0.2~1.0
    result['spatialWidth'] = 0.2 + (v / 100) * 0.8;
  }

  // orbitSpeed: 0~100 스케일로 변환
  if (properties.orbitSpeed !== undefined) {
    const v = getAudioValue('orbitSpeed');
    // rate: 0.0625~1 (지각적 곡선)
    result['rate'] = 1 / 16 + Math.pow(v / 100, 2) * (1 - 1 / 16);
    // pulses: 2~16
    result['pulses'] = Math.round(2 + Math.pow(v / 100, 1.5) * 14);
  }

  // rotationSpeed: 0~100 스케일로 변환
  if (properties.rotationSpeed !== undefined) {
    const v = getAudioValue('rotationSpeed');
    // tremHz: 0.2~12.2
    result['tremHz'] = 0.2 + Math.pow(v / 100, 2) * 12;
    // tremDepth: 0~0.7
    result['tremDepth'] = (v / 100) * 0.7;
    // vibratoRate: 2~10
    result['vibratoRate'] = 2 + (v / 100) * 8;
  }

  // inclination: 0~100 스케일로 변환
  if (properties.inclination !== undefined) {
    const v = getAudioValue('inclination');
    // pitchOffset: -6~+6
    result['pitchOffset'] = (v / 100 - 0.5) * 12;
  }

  // eccentricity: 0~100 스케일로 변환
  if (properties.eccentricity !== undefined) {
    const v = getAudioValue('eccentricity');
    // swingPct: 0~45
    result['swingPct'] = (v / 100) * 45;
    // accentDb: 0~6
    result['accentDb'] = (v / 100) * 6;
    // timing: -0.05~+0.05
    result['timing'] = (v / 100 - 0.5) * 0.1;
  }

  // tilt: 0~100 스케일로 변환
  if (properties.tilt !== undefined) {
    const v = getAudioValue('tilt');
    // pan: -0.8~+0.8
    result['pan'] = (v / 100 - 0.5) * 1.6;
    // stereoWidth: 0.1~1.5
    result['stereoWidth'] = 0.1 + (v / 100) * 1.4;
    // binaural: 0~0.3
    result['binaural'] = (v / 100) * 0.3;
  }

  // 역할별 추가 제약(간단한 처리) - 필요한 경우 audio 레이어에서 더 정교하게 처리할 수 있습니다.
  if (role === 'BASS') {
    if (result.filterCutoff !== undefined) result.filterCutoff = Math.min(result.filterCutoff, 8000);
  }

  return result;
}

export default mapPlanetToAudioTargets;
