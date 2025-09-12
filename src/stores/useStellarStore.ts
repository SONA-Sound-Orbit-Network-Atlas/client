import { create } from 'zustand';
import type { Object, StellarType } from '@/types/stellar';

interface StellarStore {
  stellarStore: StellarType;
  setStellarStore: (stellarStore: StellarType) => void;
  setInitialStellarStore: (username: string) => void;
  addNewObjectAndReturnId: () => number;
}

// 더미 stellar 데이터
const dummyStellarStore: StellarType = {
  userId: 'testUser',
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
        { label: 'size', value: 54, min: 0, max: 100, unit: 1 },
        { label: '게이지 2', value: 10, min: 0, max: 360, unit: 1 },
        { label: '게이지 3', value: 64, min: 0, max: 100, unit: 1 },
      ],
    },
    {
      name: 'BASS PLANET',
      planetType: 'PLANET',
      planetId: 1,
      status: 'ACTIVE',
      soundType: 'BASS',
      created: '2021-01-01',
      properties: [
        { label: 'size', value: 13, min: 0, max: 100, unit: 1 },
        { label: '게이지 2', value: 34, min: 0, max: 360, unit: 1 },
        { label: '게이지 3', value: 100, min: 0, max: 100, unit: 1 },
      ],
    },
  ],
};

// 초기 stellar 데이터
const initialStellarStore: StellarType = {
  userId: '',
  stellarId: '', // 백엔드 자동 생성
  stellarName: 'CENTRAL STAR SYSTEM', // 백엔드 자동 생성성
  updatedAt: '', // 현재 시각 (초기값만 프론트에서 제공)
  objects: [
    {
      name: 'CENTRAL STAR', // 수정 가능
      planetType: 'CENTRAL STAR', // 수정 불가
      planetId: 0, // 수정 불가
      status: '', // 수정 불가
      bpm: 0, // 수정 불가?
      creator: '', // (초기값) 유저 api에서 가져오기
      author: '', // (초기값) 유저 api에서 가져오기
      createSource: 'ORIGINAL COMPOSITION',
      originalSource: 'SONA STUDIO',
      properties: [
        { label: 'size', value: 0, min: 0, max: 100, unit: 1 },
        { label: '게이지 2', value: 0, min: 0, max: 360, unit: 1 },
        { label: '게이지 3', value: 0, min: 0, max: 100, unit: 1 },
      ],
    },
  ],
};

// new 오브젝트 템플릿
const newObjectTemplate: Object = {
  name: 'NEW OBJECT',
  planetType: 'PLANET',
  planetId: 1,
  status: 'ACTIVE',
  soundType: 'LEAD',
  created: '2021-01-02',
  properties: [
    { label: 'size', value: 0, min: 0, max: 100, unit: 1 },
    { label: '게이지 2', value: 0, min: 0, max: 360, unit: 1 },
    { label: '게이지 3', value: 0, min: 0, max: 100, unit: 1 },
  ],
};

// 템플릿 복제 함수
function cloneNewObject(nextId: number, index: number): Object {
  return {
    ...newObjectTemplate,
    planetId: nextId,
    name: `NEW OBJECT ${index}`, // 보기 좋게 넘버링
    properties: newObjectTemplate.properties.map((p) => ({ ...p })),
  };
}

export const useStellarStore = create<StellarStore>((set) => ({
  stellarStore: initialStellarStore,

  setStellarStore: (stellarStore) => set({ stellarStore }),

  setInitialStellarStore: (username) =>
    set(() => {
      const first = {
        ...initialStellarStore.objects[0],
        creator: username,
        author: username,
      };
      return {
        stellarStore: {
          ...initialStellarStore,
          objects: [first, ...initialStellarStore.objects.slice(1)],
        },
      };
    }),

  addNewObjectAndReturnId: () => {
    let createdId = 0;
    set((state) => {
      const prev = state.stellarStore;
      // 단순히 길이만큼 카운트
      const nextIndex = prev.objects.length; // 0부터 시작
      const newObj = cloneNewObject(nextIndex, nextIndex);
      createdId = nextIndex;

      return {
        stellarStore: {
          ...prev,
          objects: [...prev.objects, newObj],
        },
      };
    });
    return createdId; // 숫자 반환
  },
}));
