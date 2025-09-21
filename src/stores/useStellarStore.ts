// src/stores/useStellarStore.ts
import { create } from 'zustand';
import type {
  StellarSystem as StellarSystemType,
  Star,
  Planet,
  InstrumentRole,
} from '@/types/stellar';
import {
  type StarProperties,
  createDefaultStarProperties,
} from '@/types/starProperties';
import { StellarSystem } from '@/audio/core/StellarSystem';
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
// 스토어에서 사용하는 순수 데이터 타입 (클래스 인스턴스가 아닌), Planet/Star 타입은 data-only
type StellarStoreData = Omit<
  StellarSystemType,
  'audioEngine' | 'playStateListeners' | 'emitPlayState' | 'onPlayStateChange'
> & {
  planets: Planet[];
};

export const initialStellarStore: StellarStoreData = {
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
  stellarStore: StellarStoreData;
  setStellarStore: (stellarStore: StellarStoreData) => void;
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
    set(() => {
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

      const nextStore = {
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
          create_source_name: 'NEW STELLAR SYSTEM',
          original_source_name: 'NEW STELLAR SYSTEM',
          star,
          planets: [firstPlanet],
        },
      };

      // 스토어 갱신 후, 오디오 측에도 즉시 동일한 초기값을 적용합니다.
      // StellarSystem이 회색 상태라도 setSeed/updateStarProperties는 안전하게 동작해야 합니다.
      try {
        const system = StellarSystem.instance;
        // 결정적 시드 생성
        const seedStr = `${star.properties.color}|${star.properties.size}|${star.properties.spin}|${star.properties.brightness}`;
        system.setSeed(seedStr);
        system.updateStarProperties({
          color: star.properties.color,
          size: star.properties.size,
          spin: star.properties.spin,
          brightness: star.properties.brightness,
        });
        // 첫 행성도 오디오에 즉시 생성
        system.createPlanet(
          firstPlanet.role,
          firstPlanet.id,
          {
            synthType: firstPlanet.synthType,
            oscillatorType: firstPlanet.oscillatorType,
          },
          firstPlanet.properties
        );
      } catch (err) {
        // 실패해도 스토어 업데이트는 유지
        console.debug('스토어 초기화 후 오디오 동기화 중 오류:', err);
      }

      return nextStore;
    }),

  addNewObjectAndReturnId: () => {
    const newPlanetId = createPlanetId();

    set((state) => {
      const prev = state.stellarStore as StellarStoreData;

      // ✅ 요청: planetDetails 변수 사용 (랜덤 악기 구성)
      const planetDetails = createRandomPlanetInstrument();
      const newPlanet = makeInitPlanet({
        id: newPlanetId,
        systemId: prev.id ?? '',
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
    const prev = get().stellarStore as StellarStoreData;
    const nextPlanets = (prev.planets || []).filter((p) => p.id !== planetId);
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
