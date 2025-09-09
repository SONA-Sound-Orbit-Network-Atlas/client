import type { StellarType } from '@/types/stellar';

export const stellar: StellarType = {
  stellarId: 'sys-001',
  stellarName: 'CENTRAL STAR SYSTEM',
  updatedAt: '2021-01-03',
  objects: [
    {
      id: 'o-star',
      name: 'CENTRAL STAR',
      type: 'CENTRAL_STAR',
      status: 'ACTIVE',
      bpm: 120,
      creator: 'STANN',
      author: 'STANN',
      createSource: 'ORIGINAL COMPOSITION',
      originalSource: 'SONA STUDIO',
      properties: [
        { key: 'g1', label: '게이지 1', value: 54, min: 0, max: 100 },
        { key: 'g2', label: '게이지 2', value: 10, min: 0, max: 360 },
        { key: 'g3', label: '게이지 3', value: 64, min: 0, max: 100 },
      ],
    },
    {
      id: 'o-bass',
      name: 'BASS PLANET',
      type: 'PLANET',
      soundType: 'BASS',
      status: 'ACTIVE',
      created: '2021-01-01',
      properties: [
        { key: 'g1', label: '게이지 1', value: 20, min: 0, max: 100 },
      ],
    },
    {
      id: 'o-melody',
      name: 'MELODY PLANET',
      type: 'PLANET',
      soundType: 'MELODY',
      properties: [],
    },
    // ... PERCUSSION / HARMONY / EFFECTS 등
  ],
};
