// 간소화된 오디오 매핑 설정
// 기존 복잡한 매핑을 공통 InstrumentInterface 기반으로 대체합니다.

import type {
  InstrumentRole,
  PlanetPhysicalProperties,
  MappedAudioParameters,
} from '../../types/audio';
import {
  clamp,
  mapPlanetToAudioParameters,
  generateInitialPlanetProperties,
} from '../instruments/InstrumentInterface';

export { clamp };

export function mapPlanetToAudio(
  role: InstrumentRole,
  props: PlanetPhysicalProperties
): MappedAudioParameters {
  return mapPlanetToAudioParameters(role, props);
}

export function initializePropertiesFromConfig(
  rng: { nextFloat(): number }
): Record<string, number> {
  return generateInitialPlanetProperties(rng);
}
