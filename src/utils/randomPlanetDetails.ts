import {
  getSynthProfilesForRole,
  getAvailableOscillatorOptions,
  getDefaultSynthType,
  getDefaultOscillatorType,
  type SynthTypeId,
  type OscillatorTypeId,
} from '@/audio/instruments/InstrumentInterface';
import { type InstrumentRole } from '@/types/planetProperties';

const ROLES: InstrumentRole[] = [
  'DRUM',
  'BASS',
  'CHORD',
  'MELODY',
  'ARPEGGIO',
  'PAD',
];

// 공용 랜덤 픽커
function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 행성의 PLANET DETAILS(역할/신스/오실레이터) 랜덤 생성
 * - role 미지정 시 ROLES 중 임의 선택
 * - role 기반으로 프로필 목록 → 신스 타입 랜덤
 * - 프로필의 oscillatorSuggestions가 있으면 그 안에서, 없으면 전체 카탈로그에서 랜덤
 * - 비어있을 경우 각 default*로 폴백
 */
export function createRandomPlanetInstrument(role?: InstrumentRole): {
  role: InstrumentRole;
  synthType: SynthTypeId;
  oscillatorType: OscillatorTypeId;
} {
  const chosenRole = role ?? pickRandom(ROLES);

  const profiles = getSynthProfilesForRole(chosenRole);
  const synthType: SynthTypeId = profiles.length
    ? (pickRandom(profiles).id as SynthTypeId)
    : getDefaultSynthType(chosenRole);

  const oscCatalog = getAvailableOscillatorOptions();
  const preset = profiles.find((p) => p.id === synthType);
  const candidateOscs = preset?.oscillatorSuggestions?.length
    ? oscCatalog.filter((o) => preset!.oscillatorSuggestions!.includes(o.id))
    : oscCatalog;

  const oscillatorType: OscillatorTypeId = candidateOscs.length
    ? (pickRandom(candidateOscs).id as OscillatorTypeId)
    : getDefaultOscillatorType(chosenRole, synthType);

  return { role: chosenRole, synthType, oscillatorType };
}
