import React, { useState, useEffect } from 'react';
import type { 
  InstrumentRole, 
  PlanetPhysicalProperties, 
  StarGlobalState
} from '../types/audio';
import { StellarSystem } from '../audio/core/StellarSystem';
import ConfigBasedSliders from './ConfigBasedSliders';

interface PlanetUI {
  id: string;
  name: string;
  role: InstrumentRole;
  properties: PlanetPhysicalProperties;
  isPlaying: boolean;
}

const AudioTestPanel: React.FC = () => {
  const stellarSystem = StellarSystem.instance;
  const [planets, setPlanets] = useState<PlanetUI[]>([]);
  const [starGlobalState, setStarGlobalState] = useState<StarGlobalState>({
    bpm: 120,
    volume: 70,
    key: 'C',
    scale: 'Major',
    complexity: 2
  });
  const [engineReady, setEngineReady] = useState(false);
  
  useEffect(() => {
    const loadState = () => {
      const currentPlanets = stellarSystem.getPlanets();
      setPlanets(currentPlanets);
      const currentGlobalState = stellarSystem.getStarGlobalState();
      setStarGlobalState(currentGlobalState);
    };
    
    loadState();
    const interval = setInterval(loadState, 1000);
    return () => clearInterval(interval);
  }, [stellarSystem]);
  
  const initializeAudio = async () => {
    try {
      await stellarSystem.initialize();
      setEngineReady(true);
      console.log('✅ 오디오 시스템 초기화 완료!');
    } catch (error) {
      console.error('❌ 오디오 초기화 실패:', error);
    }
  };

  const addPlanet = (role: InstrumentRole) => {
    const planetId = stellarSystem.createPlanet(role);
    if (planetId) {
      console.log(`🪐 ${role} 행성 추가됨: ${planetId}`);
    }
  };

  const removePlanet = (planetId: string) => {
    stellarSystem.removePlanet(planetId);
  };

  const updatePlanetProp = (id: string, key: keyof PlanetPhysicalProperties, value: number) => {
    stellarSystem.updatePlanetProperty(id, key, value);
  };

  const togglePattern = async (planetId: string) => {
    const planet = planets.find(p => p.id === planetId);
    if (!planet) return;

    if (planet.isPlaying) {
      stellarSystem.stopPlanetPattern(planetId);
    } else {
      await stellarSystem.startPlanetPattern(planetId);
    }
  };

  const stopAllPatterns = () => {
    stellarSystem.stopAllPatterns();
  };

  const updateStarGlobalState = (key: keyof StarGlobalState, value: string | number) => {
    const newState = { ...starGlobalState, [key]: value };
    setStarGlobalState(newState);
    stellarSystem.updateStarGlobalState(newState);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-gray-900 text-white min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🎵 SONA 오디오 테스트 패널</h1>
        <p className="text-gray-300">새로운 파라미터 시스템</p>
      </div>

      {!engineReady && (
        <div className="text-center">
          <button 
            onClick={initializeAudio}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
          >
            🔊 오디오 시스템 초기화
          </button>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-3">⭐ 항성 설정</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block mb-1 font-semibold">BPM: {starGlobalState.bpm}</label>
            <input
              type="range"
              min="60"
              max="180"
              value={starGlobalState.bpm}
              onChange={(e) => updateStarGlobalState('bpm', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Volume: {starGlobalState.volume}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={starGlobalState.volume}
              onChange={(e) => updateStarGlobalState('volume', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-3">🪐 행성 추가</h2>
        <div className="flex flex-wrap gap-2">
          {(['BASS', 'DRUM', 'CHORD', 'MELODY', 'ARPEGGIO', 'PAD'] as InstrumentRole[]).map(role => (
            <button
              key={role}
              onClick={() => addPlanet(role)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
              disabled={!engineReady}
            >
              + {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={stopAllPatterns}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          disabled={!planets.some(p => p.isPlaying)}
        >
          ⏹️ 모두 정지
        </button>
        <div className="text-sm self-center">
          총 {planets.length}개 행성 | 재생 중: {planets.filter(p => p.isPlaying).length}개
        </div>
      </div>

      <div className="space-y-3">
        {planets.map(planet => (
          <div key={planet.id} className="p-3 border border-gray-700 rounded-lg bg-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{planet.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-700 rounded">{planet.role}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  planet.isPlaying ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {planet.isPlaying ? '▶️ 재생중' : '⏸️ 정지'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePattern(planet.id)}
                  className={`px-3 py-1 rounded transition-colors ${
                    planet.isPlaying ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={!engineReady}
                >
                  {planet.isPlaying ? '⏸️ 정지' : '▶️ 재생'}
                </button>
                <button
                  onClick={() => removePlanet(planet.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>

            {/* 설정 기반 슬라이더 - 파라미터 변경에 강건함 */}
            <ConfigBasedSliders
              planetId={planet.id}
              properties={planet.properties}
              onUpdate={updatePlanetProp}
            />
          </div>
        ))}
      </div>

      {planets.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>🌟 위에서 악기 역할을 선택해 첫 번째 행성을 추가해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default AudioTestPanel;
