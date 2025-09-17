// useAudioSync - Zustand 스토어와 오디오 코어(StellarSystem) 동기화 훅
// - Star/Planet 속성 변경을 감지하여 StellarSystem에 전달
// - Planet 추가/삭제를 감지하여 오디오 측에도 반영

import { useEffect, useRef } from 'react';
import { StellarSystem } from '@/audio/core/StellarSystem';
import { useStellarStore } from '@/stores/useStellarStore';
import type { StarProperties } from '@/types/starProperties';
import type { PlanetProperties, InstrumentRole } from '@/types/planetProperties';

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

export function useAudioSync() {
  const system = StellarSystem.instance;
  const { stellarStore } = useStellarStore();

  // 이전 상태 메모
  const prevStarPropsRef = useRef<StarProperties | undefined>(stellarStore.star?.properties);
  const prevPlanetIdsRef = useRef<string[]>(stellarStore.planets.map(p => p.id));
  type PlanetSnapshot = { role: InstrumentRole; properties: PlanetProperties };
  const prevPlanetPropsRef = useRef<Record<string, PlanetSnapshot>>({});

  // 초기화: 기존 행성들의 속성 스냅샷 저장
  useEffect(() => {
  const snap: Record<string, PlanetSnapshot> = {};
  stellarStore.planets.forEach(p => { snap[p.id] = { role: p.role, properties: p.properties }; });
    prevPlanetPropsRef.current = snap;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Star 전역 속성 → 오디오 전역 상태 동기화
  useEffect(() => {
    const curr = stellarStore.star?.properties as StarProperties | undefined;
    if (!curr) return;

    // 변경 감지 (얕은 비교)
    if (!prevStarPropsRef.current || !shallowEqual(curr, prevStarPropsRef.current)) {
      system.updateStarProperties(curr);
      prevStarPropsRef.current = curr;
    }
  }, [stellarStore.star?.properties, system]);

  // Planet 목록 변화(추가/삭제) 및 속성 변경 동기화
  useEffect(() => {
    const currentIds = stellarStore.planets.map(p => p.id);
    const prevIds = prevPlanetIdsRef.current;

    // 추가된 행성
    const added = currentIds.filter(id => !prevIds.includes(id));
    // 삭제된 행성
    const removed = prevIds.filter(id => !currentIds.includes(id));

    // 추가 처리
    added.forEach(async (id) => {
      const p = stellarStore.planets.find(pp => pp.id === id);
      if (!p) return;
      
      // store의 planet id를 오디오 코어의 id로 그대로 사용
      system.createPlanet(p.role, p.id);
      system.updatePlanetProperties(p.id, p.properties as PlanetProperties);
      prevPlanetPropsRef.current[id] = { role: p.role, properties: p.properties };
      
      // 다른 행성이 이미 재생 중이면 새 행성도 자동으로 시작
      const playingPlanets = system.getPlayingPlanetsCount();
      if (playingPlanets > 0) {
        try {
          await system.startPlanetPattern(p.id);
          console.log(`🎵 새 행성 ${p.role} 자동 재생 시작 (다른 행성들이 재생 중)`);
        } catch (error) {
          console.error(`새 행성 자동 재생 실패 (${p.id}):`, error);
        }
      }
    });

    // 삭제 처리
    removed.forEach(id => {
      system.removePlanet(id);
      delete prevPlanetPropsRef.current[id];
    });

    // 속성 변경 처리
    stellarStore.planets.forEach(p => {
      const prev = prevPlanetPropsRef.current[p.id];
      // 역할(Role) 변경 감지: 인스트루먼트 재구성 필요
      if (prev && p.role !== prev.role) {
        system.removePlanet(p.id);
        system.createPlanet(p.role, p.id);
        system.updatePlanetProperties(p.id, p.properties as PlanetProperties);
        prevPlanetPropsRef.current[p.id] = { role: p.role, properties: p.properties };
        return;
      }

      if (!prev || !shallowEqual(p.properties as PlanetProperties, prev.properties)) {
        console.log(`🔄 행성 ${p.role} 속성 변경 감지:`, p.properties);
        system.updatePlanetProperties(p.id, p.properties as PlanetProperties);
        prevPlanetPropsRef.current[p.id] = { role: p.role, properties: p.properties };
      }
    });

    prevPlanetIdsRef.current = currentIds;
  }, [stellarStore.planets, system]);
}
