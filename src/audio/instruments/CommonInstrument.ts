// CommonInstrument - 공통 인스트루먼트 베이스/유틸 별칭
// 프로젝트 전반에서 공통 컴포넌트를 이 파일 경로로 가져오고 싶을 때 사용하세요.
// 실제 구현은 InstrumentInterface.ts에 있습니다.

export {
  AbstractInstrumentBase,
  getSynthProfilesForRole,
  getDefaultSynthType,
  getAvailableOscillatorOptions,
  getDefaultOscillatorType,
  mapPlanetToAudioParameters,
  mapPlanetToInstrumentMacros,
  generateInitialPlanetProperties,
} from './InstrumentInterface';

export type {
  SynthTypeId,
  OscillatorTypeId,
  InstrumentUpdateContext,
  ResolvedInstrumentContext,
} from './InstrumentInterface';

