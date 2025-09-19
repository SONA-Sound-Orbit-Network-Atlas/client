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
import { formatDateToYMD } from '@/utils/formatDateToYMD';
import { createPlanetId } from '@/utils/createStarPlantId';
import {
  createRandomPlanetProperties,
  createRandomStarProperties,
} from '@/utils/randomProperties';

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
  created_at: formatDateToYMD(),
  updated_at: formatDateToYMD(),
  author_name: '',
  creator_name: '',
  create_source_name: '',
  original_source_name: '',

  // 빈 항성 및 행성 배열로 초기화
  star: {
    id: 'star_001',
    object_type: 'STAR',
    system_id: '',
    name: 'Central Star',
    properties: defaultStarProps,
    created_at: formatDateToYMD(),
    updated_at: formatDateToYMD(),
  },
  planets: [],
  position: [0, 0, 0],
};

/***** 3) 스토어 타입 *****/
interface StellarStore {
  stellarStore: StellarSystem;
  setStellarStore: (stellarStore: StellarSystem) => void;
  setInitialStellarStore: () => void;
  addNewObjectAndReturnId: () => string;
  deletePlanet: (planetId: string) => boolean;
}

// ===== 구현 =====
export const useStellarStore = create<StellarStore>((set, get) => ({
  stellarStore: initialStellarStore,

  setStellarStore: (stellarStore) =>
    set(() => {
      return {
        stellarStore: {
          ...stellarStore,
          updated_at: formatDateToYMD(),
        },
      };
    }),

  setInitialStellarStore: () =>
    set((state) => {
      // 작성자/소유자 계열 필드를 userId 기반으로 세팅 => 비로그인 경우 '' 빈 값
      // 훅 호출하지 않고, 스토어 인스턴스의 getState() 사용
      const userId = useUserStore.getState().userStore.id ?? '';
      const now = formatDateToYMD();
      const userName = useUserStore.getState().userStore.username ?? '';
      console.log('userName', userName);

      const role: InstrumentRole = 'DRUM';
      const defaultSynth = getDefaultSynthType(role);

      const newPlanetId = createPlanetId();

      return {
        stellarStore: {
          ...initialStellarStore,
          creator_id: userId,
          author_id: userId,
          create_source_id: userId,
          original_source_id: userId,
          created_at: now,
          updated_at: now,
          author_name: userName,
          creator_name: userName,
          create_source_name: state.stellarStore.title,
          original_source_name: state.stellarStore.title,

          star: {
            ...(initialStellarStore.star as Star),
            system_id: '',
            properties: createRandomStarProperties(), // 랜덤
            updated_at: now,
          },
          planets: [
            {
              id: newPlanetId,
              object_type: 'PLANET',
              system_id: '', // 아직 없을 수 있음
              name: `NEW PLANET`,
              role: 'DRUM',
              properties: createRandomPlanetProperties(), // 랜덤
              synthType: defaultSynth,
              oscillatorType: getDefaultOscillatorType(role, defaultSynth),
              created_at: formatDateToYMD(),
              updated_at: formatDateToYMD(),
            },
          ],
        },
      };
    }),

  addNewObjectAndReturnId: () => {
    const newPlanetId = createPlanetId();

    set((state) => {
      const prev = state.stellarStore;
      const role: InstrumentRole = 'DRUM';
      const defaultSynth = getDefaultSynthType(role);

      const newPlanet: Planet = {
        id: newPlanetId,
        object_type: 'PLANET',
        system_id: prev.id || '', // 아직 없을 수 있음
        name: `NEW PLANET`,
        role,
        properties: createRandomPlanetProperties(), // 랜덤
        synthType: defaultSynth,
        oscillatorType: getDefaultOscillatorType(role, defaultSynth),
        created_at: formatDateToYMD(),
        updated_at: formatDateToYMD(),
      };

      return {
        stellarStore: {
          ...prev,
          planets: [...prev.planets, newPlanet],
          updated_at: formatDateToYMD(),
        },
      };
    });

    return newPlanetId;
  },

  // 행성 삭제
  deletePlanet: (planetId) => {
    const prev = get().stellarStore;
    // const beforeLen = prev.planets.length;
    const nextPlanets = prev.planets.filter((p) => p.id !== planetId);

    // 최소 1개의 PLANET이 있어야 함
    if (nextPlanets.length === 0) {
      return false;
    }

    set({
      stellarStore: {
        ...prev,
        planets: nextPlanets,
        updated_at: formatDateToYMD(),
      },
    });

    return true;
  },
}));
