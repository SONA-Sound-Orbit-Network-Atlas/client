import type { StellarType } from '@/types/old_stellar';

export const stellar: StellarType = {
  userId: 'testUser', // testUser하면 로그인으로 가정 , bob하면 비로그인으로 가정
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
        { label: 'planetSize', value: 54, min: 0, max: 360, unit: 1 },
        { label: 'planetColor', value: 10, min: 0, max: 360, unit: 1 },
        { label: 'planetBrightness', value: 64, min: 0, max: 100, unit: 0.1 },
        { label: 'distanceFromStar', value: 10, min: 1, max: 20, unit: 0.1 },
        { label: 'orbitSpeed', value: 0.01, min: 0.01, max: 1, unit: 0.01 },
        { label: 'rotationSpeed', value: 0.01, min: 0.01, max: 1, unit: 0.01 },
        { label: 'inclination', value: 0, min: -180, max: 180, unit: 1 },
        { label: 'eccentricity', value: 0, min: 0, max: 0.9, unit: 0.1 },
        { label: 'tilt', value: 0, min: 0, max: 180, unit: 1 },
      ],
    },
    {
      name: 'BASS PLANET',
      planetType: 'PLANET',
      soundType: 'BASS',
      planetId: 1,
      status: 'ACTIVE',
      created: '2021-01-01',
      properties: [
        { label: 'planetSize', value: 54, min: 0, max: 100, unit: 0.01 },
        { label: 'planetColor', value: 10, min: 0, max: 360, unit: 1 },
        { label: 'planetBrightness', value: 64, min: 0, max: 100, unit: 0.1 },
        { label: 'distanceFromStar', value: 10, min: 1, max: 20, unit: 0.1 },
        { label: 'orbitSpeed', value: 0.01, min: 0.01, max: 1, unit: 0.01 },
        { label: 'rotationSpeed', value: 0.01, min: 0.01, max: 1, unit: 0.01 },
        { label: 'inclination', value: 0, min: -180, max: 180, unit: 1 },
        { label: 'eccentricity', value: 0, min: 0, max: 0.9, unit: 0.1 },
        { label: 'tilt', value: 0, min: 0, max: 180, unit: 1 },
      ],
    },
    {
      name: 'MELODY PLANET',
      planetType: 'PLANET',
      soundType: 'ARP',
      planetId: 2,
      properties: [
        { label: 'planetSize', value: 54, min: 0, max: 100, unit: 0.01 },
        { label: 'planetColor', value: 10, min: 0, max: 360, unit: 1 },
        { label: 'planetBrightness', value: 64, min: 0, max: 100, unit: 0.1 },
        { label: 'distanceFromStar', value: 10, min: 1, max: 20, unit: 0.1 },
        { label: 'orbitSpeed', value: 0.01, min: 0.01, max: 1, unit: 0.01 },
        { label: 'rotationSpeed', value: 0.01, min: 0.01, max: 1, unit: 0.01 },
        { label: 'inclination', value: 0, min: -180, max: 180, unit: 1 },
        { label: 'eccentricity', value: 0, min: 0, max: 0.9, unit: 0.1 },
        { label: 'tilt', value: 0, min: 0, max: 180, unit: 1 },
      ],
    },
    // ... PERCUSSION / HARMONY / EFFECTS 등
  ],
};
