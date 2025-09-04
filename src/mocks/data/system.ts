import { type PLANET, type STAR } from '@/types/system';

// STAR 더미 데이터
export const star: STAR = {
  name: 'CENTRAL STAR',
  type: 'CENTRAL STAR',
  status: 'ACTIVE',
  bpm: 120,
  creator: 'STANN',
  author: 'STANN',
  create_source: 'ORIGINAL COMPOSITION ',
  original_source: 'SONA STUDIO',
};

// PLANET 더미 데이터
export const planet: PLANET = {
  name: 'Planet 1',
  type: 'PLANET',
  status: 'active',
  sound_type: 'sound_type 1',
  last_edited: '2021-01-01',
  created: '2021-01-01',
};

// PLANETS 더미 데이터
export const planets: (STAR | PLANET)[] = [
  {
    name: 'CENTRAL STAR',
    type: 'CENTRAL STAR',
  },
  {
    name: 'BASS PLANET',
    type: 'PLANET',
    sound_type: 'BASS',
  },
  {
    name: 'MELODY PLANET',
    type: 'PLANET',
    sound_type: 'MELODY',
  },
  {
    name: 'PERCUSSION PLANET',
    type: 'PLANET',
    sound_type: 'PERCUSSION',
  },
  {
    name: 'HARMONY PLANET',
    type: 'PLANET',
    sound_type: 'HARMONY',
  },
  {
    name: 'EFFECTS PLANET',
    type: 'PLANET',
    sound_type: 'EFFECTS',
  },
];
