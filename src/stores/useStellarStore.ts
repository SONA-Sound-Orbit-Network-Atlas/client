import { create } from 'zustand';
import type { StellarType } from '@/types/stellar';

interface StellarStore {
  stellarStore: StellarType;
  setStellarStore: (stellarStore: StellarType) => void;
}

// 초기 데이터
const initialStellarStore: StellarType = {
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
      status: 'ACTIVE',
      created: '2021-01-01',
      soundType: 'BASS',
      properties: [
        { key: 'g1', label: '게이지 1', value: 13, min: 0, max: 100 },
        { key: 'g2', label: '게이지 2', value: 34, min: 0, max: 360 },
        { key: 'g3', label: '게이지 3', value: 100, min: 0, max: 100 },
      ],
    },
  ],
};

export const useStellarStore = create<StellarStore>((set) => ({
  stellarStore: initialStellarStore,
  setStellarStore: (stellarStore: StellarType) => {
    set({ stellarStore });
  },
}));
