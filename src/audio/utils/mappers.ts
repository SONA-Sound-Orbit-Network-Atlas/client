// SONA 오디오 매핑 유틸리티 (parameterConfig.ts 기반)
// 기존 인스트루먼트 호환성을 위해 유지되는 래퍼 파일입니다.

import { mapPlanetToAudio as mapFromConfig } from './parameterConfig';

// 타입들을 re-export
export type { InstrumentRole, PlanetPhysicalProperties, MappedAudioParameters } from '../../types/audio';

/**
 * 행성 속성을 오디오 파라미터로 매핑하는 메인 함수
 * 모든 인스트루먼트에서 사용하는 표준 함수입니다.
 */
export function mapPlanetToAudio(
  role: import('../../types/audio').InstrumentRole,
  planetProps: import('../../types/audio').PlanetPhysicalProperties
): import('../../types/audio').MappedAudioParameters {
  return mapFromConfig(role, planetProps);
}

/**
 * 행성 속성을 오디오 파라미터로 매핑하는 별칭 함수
 * @deprecated mapPlanetToAudio를 직접 사용하는 것을 권장합니다.
 */
export function mapPlanetToAudioParams(
  role: import('../../types/audio').InstrumentRole,
  planetProps: import('../../types/audio').PlanetPhysicalProperties
): import('../../types/audio').MappedAudioParameters {
  return mapFromConfig(role, planetProps);
}

// 하위 호환성을 위한 별칭 함수들
export const mapToLead = (props: import('../../types/audio').PlanetPhysicalProperties) => 
  mapFromConfig('MELODY', props);
export const mapToBass = (props: import('../../types/audio').PlanetPhysicalProperties) => 
  mapFromConfig('BASS', props);
export const mapToChord = (props: import('../../types/audio').PlanetPhysicalProperties) => 
  mapFromConfig('CHORD', props);
export const mapToPad = (props: import('../../types/audio').PlanetPhysicalProperties) => 
  mapFromConfig('PAD', props);
export const mapToArp = (props: import('../../types/audio').PlanetPhysicalProperties) => 
  mapFromConfig('ARPEGGIO', props);
export const mapToDrum = (props: import('../../types/audio').PlanetPhysicalProperties) => 
  mapFromConfig('DRUM', props);
