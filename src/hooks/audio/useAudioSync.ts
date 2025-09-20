// useAudioSync - Zustand 스토어와 오디오 코어(StellarSystem) 동기화 훅
// - Star/Planet 속성 변경을 감지하여 StellarSystem에 전달
// - Planet 추가/삭제를 감지하여 오디오 측에도 반영

import { useEffect, useRef, useCallback } from 'react';
import { StellarSystem } from '@/audio/core/StellarSystem';
import { AudioEngine } from '@/audio/core/AudioEngine';
import { useStellarStore } from '@/stores/useStellarStore';
import type { StarProperties } from '@/types/starProperties';
import type { PlanetProperties, InstrumentRole } from '@/types/planetProperties';
import {
  getDefaultSynthType,
  getDefaultOscillatorType,
  type SynthTypeId,
  type OscillatorTypeId,
} from '@/audio/instruments/InstrumentInterface';

// 간단한 참조 동등성 비교 유틸 (얕은 비교)
function shallowEqual<T extends object>(a: T, b: T): boolean {
  const aKeys = Object.keys(a) as Array<keyof T>;
  const bKeys = Object.keys(b) as Array<keyof T>;
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if ((a as T)[k] !== (b as T)[k]) return false;
  }
  return true;
}

interface PlanetSnapshot {
  role: InstrumentRole;
  properties: PlanetProperties;
  synthType: SynthTypeId;
  oscillatorType: OscillatorTypeId;
}

export function useAudioSync() {
  const system = StellarSystem.instance;
  const { stellarStore } = useStellarStore();

  const prevStarPropsRef = useRef<StarProperties | undefined>(stellarStore.star?.properties);
  const prevPlanetIdsRef = useRef<string[]>([]);
  const prevPlanetPropsRef = useRef<Record<string, PlanetSnapshot>>({});
  const prevSystemIdRef = useRef<string | undefined>(undefined);
  const isInitializedRef = useRef(false);
  const isResettingRef = useRef(false);

  const syncPlanets = useCallback((allowDuringInit = false) => {
    if (!allowDuringInit && !isInitializedRef.current) return;
    if (isResettingRef.current) return;

    const currentSystemId = stellarStore.id;

    // 현재 스텔라에 속하는 행성만 필터링
    const activePlanets = stellarStore.planets.filter(({ system_id }) => {
      if (!system_id || !currentSystemId) return true;
      return system_id === currentSystemId;
    });

    const currentIds = activePlanets.map((p) => p.id);
    const prevIds = prevPlanetIdsRef.current;

    // 디버그: sync 시점에 전달되는 행성 ID와 StellarSystem 내부 맵 상태 확인
    try {
  const ss = system as unknown as { planets?: Map<string, unknown> };
  console.debug('[useAudioSync] syncPlanets activeIds=', currentIds, 'stellarSystemPlanets=', Array.from(ss.planets?.keys?.() || []));
    } catch (e) {
      console.debug('[useAudioSync] syncPlanets debug failure', e);
    }

    // 제거된 행성 처리
    const removed = prevIds.filter((id) => !currentIds.includes(id));
    removed.forEach((id) => {
      system.removePlanet(id);
      delete prevPlanetPropsRef.current[id];
    });

    // 추가/변경 처리
    activePlanets.forEach((planet) => {
      const prev = prevPlanetPropsRef.current[planet.id];
      const synthType = planet.synthType ?? getDefaultSynthType(planet.role);
      const oscillatorType =
        planet.oscillatorType ?? getDefaultOscillatorType(planet.role, synthType);

      if (!prev) {
        // 신규 행성 (스토어의 랜덤 프로퍼티를 초기값으로 전달)
        system.createPlanet(planet.role, planet.id, { synthType, oscillatorType }, planet.properties as PlanetProperties);
      } else if (prev.role !== planet.role) {
        // 역할 변경 시 StellarSystem의 changePlanetRole을 사용하여 역할을 안전하게 변경
        const ok = system.changePlanetRole(planet.id, planet.role, { synthType, oscillatorType });
        if (!ok) {
          // 실패 시 fallback: recreate
          system.removePlanet(planet.id);
          system.createPlanet(planet.role, planet.id, { synthType, oscillatorType });
        }
      }

      if (!prev || prev.synthType !== synthType || prev.oscillatorType !== oscillatorType) {
        system.updatePlanetSynthSettings(planet.id, { synthType, oscillatorType });
      }

      if (!prev || !shallowEqual(planet.properties as PlanetProperties, prev.properties)) {
        // StellarSystem에 해당 행성이 실제로 존재하는지 확인
        const existing = system.getPlanet(planet.id);
        if (!existing) {
          console.debug(`[useAudioSync] syncPlanets: target planet missing in StellarSystem, recreating with initial properties: ${planet.id}`);
          system.createPlanet(planet.role, planet.id, { synthType, oscillatorType }, planet.properties as PlanetProperties);
        } else {
          system.updatePlanetProperties(planet.id, planet.properties as PlanetProperties);
        }
      }

      prevPlanetPropsRef.current[planet.id] = {
        role: planet.role,
        properties: planet.properties,
        synthType,
        oscillatorType,
      };
    });

    prevPlanetIdsRef.current = currentIds;
  }, [stellarStore.planets, stellarStore.id, system]);

  // 초기화: 기존 행성들을 오디오 시스템으로 동기화 + 스냅샷 저장
  useEffect(() => {
    if (isInitializedRef.current) return;

    // useAudioSync initialization start: stellarId=%s, planetsCount=%d

    // 먼저 스토어의 Star 프로퍼티가 있으면 오디오 시스템에 적용하고 시드를 설정합니다.
    try {
      const currStarProps = stellarStore.star?.properties as StarProperties | undefined;
      if (currStarProps) {
        system.updateStarProperties(currStarProps);
        prevStarPropsRef.current = currStarProps;
        try {
          const seedStr = `${currStarProps.color}|${currStarProps.size}|${currStarProps.spin}|${currStarProps.brightness}`;
          system.setSeed(seedStr);
        } catch (err) {
          console.debug('초기 스타 시드 설정 중 오류:', err);
        }
      }
    } catch (err) {
      console.debug('초기 스타 프로퍼티 오디오 동기화 중 오류:', err);
    }

    // 그 다음에 행성 동기화를 실행해 Planet 생성 시점에 시드가 이미 설정되도록 보장합니다.
    syncPlanets(true);
    prevSystemIdRef.current = stellarStore.id;
    isInitializedRef.current = true;

  // useAudioSync initialization complete
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Star 전역 속성 → 오디오 전역 상태 동기화
  useEffect(() => {
    const curr = stellarStore.star?.properties as StarProperties | undefined;
    if (!curr || !isInitializedRef.current) return;

    if (!prevStarPropsRef.current || !shallowEqual(curr, prevStarPropsRef.current)) {
      system.updateStarProperties(curr);
      prevStarPropsRef.current = curr;
    }
  }, [stellarStore.star?.properties, system]);

  // 스텔라 ID 변경 시: 부드러운 페이드아웃 + 리셋
  useEffect(() => {
    const currentSystemId = stellarStore.id;
    if (!isInitializedRef.current) return;

    if (prevSystemIdRef.current && prevSystemIdRef.current !== currentSystemId) {
  // Stellar system change detected: ${prevSystemIdRef.current} -> ${currentSystemId}

      (async () => {
        try {
          const engine = AudioEngine.instance;
          engine.beginTransition();
          isResettingRef.current = true;

          await system.resetImmediate();
          // Audio system reset complete

          engine.endTransition();

          prevPlanetPropsRef.current = {};
          prevPlanetIdsRef.current = [];
          isResettingRef.current = false;

          syncPlanets();
        } catch (error) {
          console.error('🔄 스텔라 시스템 리셋 중 오류:', error);
          isResettingRef.current = false;
        }
      })();
    }

    prevSystemIdRef.current = currentSystemId;
  }, [stellarStore.id, system, syncPlanets]);

  // Planet 목록 변화(추가/삭제) 및 속성 변경 동기화
  useEffect(() => {
    if (!isInitializedRef.current || isResettingRef.current) return;
    syncPlanets();
  }, [syncPlanets, stellarStore.planets, stellarStore.id]);
}
