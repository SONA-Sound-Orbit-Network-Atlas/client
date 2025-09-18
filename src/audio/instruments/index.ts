// 모든 악기 클래스들을 export하는 인덱스 파일
// 각 악기는 독립적으로 구현되어 있으며 Instrument 인터페이스를 구현합니다.

export type { Instrument } from './InstrumentInterface';
export { BassInstrument } from './BassInstrument';
export { DrumInstrument } from './DrumInstrument';
export { PadInstrument } from './PadInstrument';
export { MelodyInstrument } from './MelodyInstrument';
export { ArpeggioInstrument } from './ArpeggioInstrument';
export { ChordInstrument } from './ChordInstrument';

// 악기 역할별 타입
export type { InstrumentRole } from '../../types/audio';

// 편의를 위한 악기 팩토리 함수
import type { InstrumentRole } from '../../types/audio';
import type { Instrument } from './InstrumentInterface';
import { BassInstrument } from './BassInstrument';
import { DrumInstrument } from './DrumInstrument';
import { PadInstrument } from './PadInstrument';
import { MelodyInstrument } from './MelodyInstrument';
import { ArpeggioInstrument } from './ArpeggioInstrument';
import { ChordInstrument } from './ChordInstrument';

/**
 * 역할에 따라 적절한 악기 인스턴스를 생성하는 팩토리 함수
 * @param role - 악기의 역할 (BASS, DRUM, PAD, MELODY, ARPEGGIO, CHORD)
 * @param id - 악기의 고유 ID (기본값: 역할명 소문자)
 * @returns 해당 역할에 맞는 악기 인스턴스
 */
export function createInstrument(role: InstrumentRole, id?: string): Instrument {
  const instrumentId = id || role.toLowerCase();
  
  switch (role) {
    case 'BASS':
      return new BassInstrument(instrumentId);
    case 'DRUM':
      return new DrumInstrument(instrumentId);
    case 'PAD':
      return new PadInstrument(instrumentId);
    case 'MELODY':
      return new MelodyInstrument(instrumentId);
    case 'ARPEGGIO':
      return new ArpeggioInstrument(instrumentId);
    case 'CHORD':
      return new ChordInstrument(instrumentId);
    default:
      throw new Error(`지원하지 않는 악기 역할: ${role}`);
  }
}

/**
 * 모든 악기 역할 목록
 */
export const INSTRUMENT_ROLES: readonly InstrumentRole[] = [
  'BASS',
  'DRUM', 
  'PAD',
  'MELODY',
  'ARPEGGIO',
  'CHORD'
] as const;

/**
 * 역할별 기본 설정
 */
export const INSTRUMENT_DEFAULTS = {
  BASS: {
    name: '베이스',
    description: '깊고 강력한 저음역 리듬 악기',
    range: [28, 52],
    polyphony: 1
  },
  DRUM: {
    name: '드럼',
    description: '리듬과 그루브를 담당하는 타악기',
    range: null, // 채널별 고정
    polyphony: 4
  },
  PAD: {
    name: '패드',
    description: '분위기와 공간감을 만드는 배경 악기',
    range: [36, 84],
    polyphony: 8
  },
  MELODY: {
    name: '멜로디',
    description: '표현력 있는 주선율 악기',
    range: [55, 84],
    polyphony: 1
  },
  ARPEGGIO: {
    name: '아르페지오',
    description: '빠른 패턴과 시퀀스를 연주하는 악기',
    range: [48, 84],
    polyphony: 1
  },
  CHORD: {
    name: '화음',
    description: '풍부한 화음을 연주하는 악기',
    range: [36, 72],
    polyphony: 8
  }
} as const;
