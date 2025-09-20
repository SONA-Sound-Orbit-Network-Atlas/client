// src/stores/useStellarStore.ts
import { create } from 'zustand';
import type {
  StellarSystem,
  Star,
  Planet,
  InstrumentRole,
} from '@/types/stellar';
import {
  type StarProperties,
  createDefaultStarProperties,
} from '@/types/starProperties';
import {
  type PlanetProperties,
  createDefaultProperties,
} from '@/types/planetProperties';
import { useUserStore } from '@/stores/useUserStore';
import {
  getDefaultSynthType,
  getDefaultOscillatorType,
  type SynthTypeId,
  type OscillatorTypeId,
} from '@/audio/instruments/InstrumentInterface';
import { formatDateToYMD } from '@/utils/formatDateToYMD';
import { createPlanetId } from '@/utils/createStarPlantId';
import {
  createRandomPlanetProperties,
  createRandomStarProperties,
} from '@/utils/randomProperties';
import { createRandomPlanetInstrument } from '@/utils/randomPlanetDetails';

/***** 공통 상수/헬퍼 *****/
const DEFAULT_ROLE: InstrumentRole = 'DRUM';
const nowYMD = () => formatDateToYMD();

/** 초기 Star 오브젝트(랜덤 프로퍼티 포함) 생성 */
function makeInitStar(overrides?: Partial<Star>): Star {
  const now = nowYMD();
  return {
    ...(initialStellarStore.star as Star),
    system_id: '',
    properties: createRandomStarProperties(),
    updated_at: now,
    ...overrides,
  };
}

/** 초기 Planet 오브젝트(랜덤 프로퍼티 + PLANET DETAILS 포함) 생성 */
function makeInitPlanet(params?: {
  id?: string;
  systemId?: string;
  role?: InstrumentRole;
  name?: string;
  planetDetails?: {
    role: InstrumentRole;
    synthType: SynthTypeId;
    oscillatorType: OscillatorTypeId;
  };
}): Planet {
  const id = params?.id ?? createPlanetId();
  const systemId = params?.systemId ?? '';
  const name = params?.name ?? 'NEW PLANET';
  const now = nowYMD();

  // planetDetails가 주어지면 사용, 아니면 (role 또는 기본 역할) 기준으로 폴백
  const chosenRole =
    params?.planetDetails?.role ?? params?.role ?? DEFAULT_ROLE;
  const synth =
    params?.planetDetails?.synthType ?? getDefaultSynthType(chosenRole);
  const oscillator =
    params?.planetDetails?.oscillatorType ??
    getDefaultOscillatorType(chosenRole, synth);

  return {
    id,
    object_type: 'PLANET',
    system_id: systemId,
    name,
    role: chosenRole,
    properties: createRandomPlanetProperties(),
    synthType: synth,
    oscillatorType: oscillator,
    created_at: now,
    updated_at: now,
  };
}

/***** 1) 기본 프로퍼티 디폴트 (템플릿 보존) *****/
const defaultStarProps: StarProperties = createDefaultStarProperties();
export const defaultPlanetProps: PlanetProperties = createDefaultProperties();

/***** 2) 초기 스텔라 시스템 (템플릿) *****/
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
  star: {
    id: 'star_001',
    object_type: 'STAR',
    system_id: '',
    name: 'Central Star',
    properties: defaultStarProps, // 실제 초기화 시엔 makeInitStar가 랜덤으로 교체
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

/***** 구현 *****/
export const useStellarStore = create<StellarStore>((set, get) => ({
  stellarStore: initialStellarStore,

  setStellarStore: (stellarStore) =>
    set(() => ({
      stellarStore: { ...stellarStore, updated_at: nowYMD() },
    })),

  setInitialStellarStore: () =>
    set((state) => {
      const userId = useUserStore.getState().userStore.id ?? '';
      const userName = useUserStore.getState().userStore.username ?? '';
      const now = nowYMD();

      // STAR/첫 번째 PLANET 생성
      const star = makeInitStar();

      // ✅ 요청: planetDetails 변수 사용 (랜덤 악기 구성)
      const planetDetails = createRandomPlanetInstrument();
      const firstPlanetId = createPlanetId();
      const firstPlanet = makeInitPlanet({
        id: firstPlanetId,
        name: 'NEW PLANET',
        planetDetails,
      });

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
          // 기존 로직 유지
          create_source_name: state.stellarStore.title,
          original_source_name: state.stellarStore.title,
          star,
          planets: [firstPlanet],
        },
      };
    }),

  addNewObjectAndReturnId: () => {
    const newPlanetId = createPlanetId();

    set((state) => {
      const prev = state.stellarStore;

      // ✅ 요청: planetDetails 변수 사용 (랜덤 악기 구성)
      const planetDetails = createRandomPlanetInstrument();
      const newPlanet = makeInitPlanet({
        id: newPlanetId,
        systemId: prev.id || '',
        name: 'NEW PLANET',
        planetDetails,
      });

      return {
        stellarStore: {
          ...prev,
          planets: [...prev.planets, newPlanet],
          updated_at: nowYMD(),
        },
      };
    });

    return newPlanetId;
  },

  deletePlanet: (planetId) => {
    const prev = get().stellarStore;
    const nextPlanets = prev.planets.filter((p) => p.id !== planetId);
    if (nextPlanets.length === 0) return false; // 규칙 유지: 최소 1개 보장

    set({
      stellarStore: {
        ...prev,
        planets: nextPlanets,
        updated_at: nowYMD(),
      },
    });
    return true;
  },
}));
