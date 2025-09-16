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
  galaxy_id: '',
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
    name: 'Central Star',
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
          owner_id: userId,
          created_by_id: userId,
          original_author_id: userId,
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
