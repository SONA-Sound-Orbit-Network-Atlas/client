import { mergeClassNames } from '@/utils/mergeClassNames';
import Play from './Play';
import Volume from './Volume';
import { AudioEngine } from '@/audio/core/AudioEngine';
import { StellarSystem } from '@/audio/core/StellarSystem';
import { useCallback, useEffect, useState } from 'react';
import { useAudioSync } from '@/hooks/audio/useAudioSync';

interface AudioPlayerProps {
  className?: string;
}

export default function AudioPlayer({ className }: AudioPlayerProps) {
  // AudioEngine & StellarSystem 싱글톤 인스턴스 확보
  const engine = AudioEngine.instance;
  const system = StellarSystem.instance;
  useAudioSync();

  const [ready, setReady] = useState(engine.isReady());

  // 초기 1회: 시스템 준비
  useEffect(() => {
    // 패널이 마운트 되어 있을 때, 필요시 엔진 초기화
    if (!engine.isReady()) {
      // 전역 상태는 Star에 의해 결정되므로, 시스템이 알아서 전달
      system.initialize().then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [engine, system]);

  const handleTogglePlay = useCallback(async (isPlaying: boolean) => {
    // Play 컴포넌트는 토글 전 상태를 전달하므로 반전 해석
    const willPlay = !isPlaying;
    if (!ready) return;
    
    if (willPlay) {
      const planets = system.getPlanets();
      
      // 행성이 없으면 데모용 MELODY 하나 추가
      if (planets.length === 0) {
        const id = system.createPlanet('MELODY');
        await system.startPlanetPattern(id);
        console.log('🎵 데모용 MELODY 행성 추가 및 재생 시작');
      } else {
        // 모든 행성의 패턴을 시작
        for (const planet of planets) {
          if (!planet.isPlaying) {
            await system.startPlanetPattern(planet.id);
            console.log(`🎵 ${planet.name} 패턴 재생 시작`);
          }
        }
      }
    } else {
      // 모든 패턴 정지
      system.stopAllPatterns();
      console.log('⏹️ 모든 패턴 정지');
    }
  }, [ready, system]);

  const handleVolumeChange = useCallback((v: number) => {
    engine.setMasterVolume(v);
  }, [engine]);

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
      />
      {/* 볼륨게이지 */}
      <Volume
        className="flex-1"
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
