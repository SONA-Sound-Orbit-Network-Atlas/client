import type { StellarType } from '@/types/stellar';

export const stellar: StellarType = {
  userId: 'bob',
  stellarId: 'sys-001',
  stellarName: 'CENTRAL STAR SYSTEM',
  updatedAt: '2021-01-03',
  objects: [
    {
      name: 'CENTRAL STAR',
      planetType: 'CENTRAL STAR',
      planetId: 0,
      status: 'ACTIVE',
      bpm: 120,
      creator: 'STANN',
      author: 'STANN',
      createSource: 'ORIGINAL COMPOSITION',
      originalSource: 'SONA STUDIO',
      properties: [
        { label: 'size', value: 54, min: 0, max: 100 },
        { label: '게이지 2', value: 10, min: 0, max: 360 },
        { label: '게이지 3', value: 64, min: 0, max: 100 },
      ],
    },
    {
      name: 'BASS PLANET',
      planetType: 'PLANET',
      soundType: 'BASS',
      planetId: 1,
      status: 'ACTIVE',
      created: '2021-01-01',
      properties: [{ label: 'size', value: 20, min: 0, max: 100 }],
    },
    {
      name: 'MELODY PLANET',
      planetType: 'PLANET',
      soundType: 'ARP',
      planetId: 2,
      properties: [],
    },
    // ... PERCUSSION / HARMONY / EFFECTS 등
  ],
};
