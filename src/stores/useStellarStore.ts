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

/***** 1) 기본 프로퍼티 디폴트 *****/
const defaultStarProps: StarProperties = {
  spin: 120,
  brightness: 1,
  color: 1,
  size: 1,
};

const defaultPlanetProps: PlanetProperties = {
  size: 0.5,
  color: 0,
  brightness: 3,
  distanceFromStar: 8,
  orbitSpeed: 0.4,
  rotationSpeed: 0.4,
  eccentricity: 0.2,
  tilt: 0,
};

/***** 2) 초기 스텔라 시스템 *****/
export const initialStellarStore: StellarSystem = {
  id: '',
  title: 'NEW STELLAR SYSTEM',
  owner_id: '',
  created_by_id: '',
  original_author_id: '',
  source_system_id: '',
  created_via: 'MANUAL',
  created_at: '',
  updated_at: '',

  star: {
    id: 'star_001',
    object_type: 'STAR',
    system_id: '',
    properties: defaultStarProps,
    created_at: '',
    updated_at: '',
  },
  planets: [],
};

/***** 3) 유틸: 임시 ID 생성 *****/
// function genId(prefix: string = 'tmp'): string {
//   return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

/***** 4) 스토어 타입 *****/
interface StellarStore {
  stellarStore: StellarSystem;
  setStellarStore: (stellarStore: StellarSystem) => void;
  setInitialStellarStore: (username: string) => void;
  addNewObjectAndReturnId: () => string;
}

// ===== 구현 =====
export const useStellarStore = create<StellarStore>((set) => ({
  stellarStore: initialStellarStore,

  setStellarStore: (stellarStore) => set({ stellarStore }),

  setInitialStellarStore: (username) =>
    set(() => {
      // 작성자/소유자 계열 필드를 username 기반으로 세팅
      const now = new Date().toISOString();
      return {
        stellarStore: {
          ...initialStellarStore,
          owner_id: username,
          created_by_id: username,
          original_author_id: username,
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
      const newPlanet: Planet = {
        id: 'planet_' + (prev.planets.length + 1),
        object_type: 'PLANET',
        system_id: prev.id || '', // 아직 없을 수 있음
        name: `NEW PLANET ${prev.planets.length + 1}`,
        role: 'DRUM' as InstrumentRole,
        properties: { ...defaultPlanetProps },
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
