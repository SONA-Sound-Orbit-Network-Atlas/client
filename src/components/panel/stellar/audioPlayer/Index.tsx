import { mergeClassNames } from '@/utils/mergeClassNames';
import Play from './Play';
import Volume from './Volume';
import { AudioEngine } from '@/audio/core/AudioEngine';
import { StellarSystem } from '@/audio/core/StellarSystem';
import { useStellarStore } from '@/stores/useStellarStore';
import {
  getDefaultSynthType,
  getDefaultOscillatorType,
} from '@/audio/instruments/InstrumentInterface';
import type { PlanetProperties } from '@/types/planetProperties';
import { useCallback, useEffect, useState } from 'react';
import { useAudioSync } from '@/hooks/audio/useAudioSync';

interface AudioPlayerProps {
  className?: string;
}

export default function AudioPlayer({ className }: AudioPlayerProps) {
  // AudioEngine & StellarSystem 싱글톤 인스턴스 확보
  const engine = AudioEngine.instance;
  const system = StellarSystem.instance;
  const { stellarStore } = useStellarStore();
  useAudioSync();

  const [ready, setReady] = useState(engine.isReady());
  const [initializing, setInitializing] = useState(false);
  const [transitioning, setTransitioning] = useState(engine.isTransitioning());
  const [playing, setPlaying] = useState(false);

  // 전환 상태 구독
  useEffect(() => {
    const off = engine.onTransition(setTransitioning);
    return () => off();
  }, [engine]);

  // 글로벌 재생 상태 구독
  useEffect(() => {
    const off = system.onPlayStateChange(setPlaying);
    return () => off();
  }, [system]);

  const handleTogglePlay = useCallback(async (nextIsPlaying: boolean) => {
    // Play 컴포넌트는 토글 후 상태를 전달함
    const willPlay = nextIsPlaying;
    if (!ready) {
      if (!willPlay) return;
      if (initializing) return;
      setInitializing(true);
      try {
        await system.initialize();
        setReady(true);
        // 최초 초기화 직후에도 현재 설정된 마스터 볼륨을 반드시 반영
        engine.setMasterVolume(engine.getMasterVolume());
      } catch (error) {
        console.error('오디오 시스템 초기화 실패:', error);
        setInitializing(false);
        return;
      }
      setInitializing(false);
    }

    if (willPlay) {
      let planets = system.getPlanets();

      // 폴백: StellarSystem에 행성이 없을 경우 zustand 스토어에서 생성
      if (planets.length === 0 && stellarStore.planets.length > 0) {
        console.log('▶️ system에 행성이 없어 스토어 기반으로 생성합니다...');
        for (const p of stellarStore.planets) {
          const synthType = p.synthType ?? getDefaultSynthType(p.role);
          const oscillatorType = p.oscillatorType ?? getDefaultOscillatorType(p.role, synthType);
          system.createPlanet(p.role, p.id, { synthType, oscillatorType });
          // 안전하게 속성 적용
          try {
            system.updatePlanetProperties(p.id, p.properties as PlanetProperties);
          } catch (err) {
            console.warn('스토어 기반 행성 속성 적용 실패:', err);
          }
        }
        planets = system.getPlanets();
      }

      // 행성이 없으면 아무 소리도 내지 않음 (데모 행성 생성 제거)
      if (planets.length === 0) {
        console.log('▶️ 재생 요청: 행성이 없어 소리를 내지 않습니다.');
        return;
      }

      // 모든 행성의 패턴을 시작
      for (const planet of planets) {
        if (!planet.isPlaying) {
          await system.startPlanetPattern(planet.id);
          console.log(`🎵 ${planet.name} 패턴 재생 시작`);
        }
      }
    } else {
      // 모든 패턴 정지
      system.stopAllPatterns();
      console.log('⏹️ 모든 패턴 정지');
    }
  }, [initializing, ready, system, engine, stellarStore.planets]);

  return (
    <div
      className={mergeClassNames(
        'p-[10px] flex items-center gap-[10px]',
        className
      )}
    >
      {/* 재생버튼 */}
      <Play
        className="w-[32px] h-[32px] rounded-full flex-shrink-0"
        onClick={handleTogglePlay}
        disabled={transitioning || initializing}
        playing={playing}
      />
      {/* 볼륨게이지 */}
      <Volume
        className="flex-1"
      />
    </div>
  );
}
