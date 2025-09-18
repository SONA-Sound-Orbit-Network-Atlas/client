// src/stores/useStellarSystemStore.ts
import { create } from 'zustand';
import type {
  StellarSystem,
  Star,
  Planet,
  InstrumentRole,
} from '@/types/stellar';
import type { StarProperties } from '@/types/starProperties';
import type { PlanetProperties } from '@/types/planetProperties';
import { useUserStore } from '@/stores/useUserStore';
import { createDefaultProperties } from '@/types/planetProperties';
import {
  getDefaultSynthType,
  getDefaultOscillatorType,
} from '@/audio/instruments/InstrumentInterface';

/***** 1) 기본 프로퍼티 디폴트 *****/
const defaultStarProps: StarProperties = {
  spin: 50,
  brightness: 1,
  color: 1,
  size: 1.0, // 적절한 크기 범위 (0.1 ~ 2.0)
};

export const defaultPlanetProps: PlanetProperties = createDefaultProperties();

/***** 2) 초기 스텔라 시스템 *****/
export const initialStellarStore: StellarSystem = {
  id: '',
  title: 'NEW STELLAR SYSTEM',
  galaxy_id: 'gal_abc123',
  creator_id: '',
  author_id: '',
  create_source_id: '',
  original_source_id: '',
  created_via: 'MANUAL',
  created_at: '',
  updated_at: '',

  star: {
    id: 'star_001',
    object_type: 'STAR',
    system_id: '',
    name: 'Central Star',
    properties: defaultStarProps,
    created_at: '',
    updated_at: '',
  },
  planets: [],
  position: [0, 0, 0],
};

/***** 3) 유틸: 임시 ID 생성 *****/
// function genId(prefix: string = 'tmp'): string {
//   return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

/***** 4) 스토어 타입 *****/
interface StellarStore {
  stellarStore: StellarSystem;
  setStellarStore: (stellarStore: StellarSystem) => void;
  setInitialStellarStore: () => void;
  addNewObjectAndReturnId: () => string;
}

// ===== 구현 =====
export const useStellarStore = create<StellarStore>((set) => ({
  stellarStore: initialStellarStore,

  setStellarStore: (stellarStore) => set({ stellarStore }),

  setInitialStellarStore: () =>
    set(() => {
      // 작성자/소유자 계열 필드를 userId 기반으로 세팅 => 비로그인 경우 '' 빈 값
      // 훅 호출하지 않고, 스토어 인스턴스의 getState() 사용
      const userId = useUserStore.getState().userStore.id ?? '';
      const now = new Date().toISOString();
      return {
        stellarStore: {
          ...initialStellarStore,
          creator_id: userId,
          author_id: userId,
          create_source_id: userId,
          original_source_id: userId,
          created_at: now,
          updated_at: now,
          star: {
            ...(initialStellarStore.star as Star),
            system_id: '',
            properties: { ...defaultStarProps },
            updated_at: now,
          },
          planets: [],
        },
      };
    }),

  addNewObjectAndReturnId: () => {
    let createdIndex = 0;
    set((state) => {
      const prev = state.stellarStore;

      // 새 planet 1개 추가
      const role: InstrumentRole = 'DRUM';
      const defaultSynth = getDefaultSynthType(role);
      const newPlanet: Planet = {
        id: 'planet_' + (prev.planets.length + 1),
        object_type: 'PLANET',
        system_id: prev.id || '', // 아직 없을 수 있음
        name: `NEW PLANET ${prev.planets.length + 1}`,
        role,
        properties: { ...defaultPlanetProps },
        synthType: defaultSynth,
        oscillatorType: getDefaultOscillatorType(role, defaultSynth),
        created_at: '',
        updated_at: new Date().toISOString(),
      };

      const nextPlanets = [...prev.planets, newPlanet];
      createdIndex = nextPlanets.length;

      return {
        stellarStore: {
          ...prev,
          planets: nextPlanets,
          updated_at: new Date().toISOString(),
        },
      };
    });

    return 'planet_' + createdIndex;
  },
}));
