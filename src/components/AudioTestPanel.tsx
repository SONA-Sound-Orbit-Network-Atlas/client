import React, { useState, useEffect } from 'react';
import type { 
  InstrumentRole, 
  PlanetPhysicalProperties, 
  StarGlobalState
} from '../types/audio';
import { StellarSystem } from '../audio/core/StellarSystem';

// 간소화된 행성 인터페이스 (UI용)
interface PlanetUI {
  id: string;
  name: string;
  role: InstrumentRole;
  properties: PlanetPhysicalProperties;
  isPlaying: boolean;
}

// 오디오 테스트 패널 컴포넌트 - 새로운 StellarSystem 아키텍처 사용
const AudioTestPanel: React.FC = () => {
  // StellarSystem 인스턴스 가져오기 (싱글톤)
  const stellarSystem = StellarSystem.instance;
  
  // UI 상태 관리
  const [planets, setPlanets] = useState<PlanetUI[]>([]);
  const [starProperties, setStarProperties] = useState({ spin: 50, brightness: 70, color: 0, size: 50 });
  const [starGlobalState, setStarGlobalState] = useState<StarGlobalState>({
    bpm: 120,
    volume: 70,
    key: 'C',
    scale: 'Major',
    complexity: 2
  });
  const [engineReady, setEngineReady] = useState(false);
  
  // 초기 상태 로딩
  useEffect(() => {
    const loadInitialState = () => {
      const currentPlanets = stellarSystem.getPlanets();
      setPlanets(currentPlanets);
      
      const currentStarProperties = stellarSystem.getStarProperties();
      setStarProperties(currentStarProperties);
      
      const currentGlobalState = stellarSystem.getStarGlobalState();
      setStarGlobalState(currentGlobalState);
    };
    
    loadInitialState();
    
    // 주기적으로 상태 업데이트 (재생 상태 변화 반영)
    const interval = setInterval(loadInitialState, 1000);
    
    return () => clearInterval(interval);
  }, [stellarSystem]);

  // 오디오 시스템 초기화
  const initAudio = async () => {
    try {
      console.log('🌌 SONA StellarSystem 초기화 시작...');
      
      await stellarSystem.initialize();
      setEngineReady(true);
      
      // 초기 상태 다시 로딩
      const currentStarProperties = stellarSystem.getStarProperties();
      setStarProperties(currentStarProperties);
      
      const currentGlobalState = stellarSystem.getStarGlobalState();
      setStarGlobalState(currentGlobalState);
      
      console.log('🎉 SONA StellarSystem 초기화 완료!');
    } catch (error) {
      console.error('❌ StellarSystem 초기화 실패:', error);
      alert(`StellarSystem 초기화에 실패했습니다: ${error}`);
    }
  };

  // 새로운 행성 추가
  const addPlanet = (role: InstrumentRole) => {
    if (!engineReady) {
      alert('먼저 오디오 시스템을 초기화해주세요.');
      return;
    }
    
  const planetId = stellarSystem.addPlanet(role);
    
  // UI 상태 업데이트
  const newPlanets = stellarSystem.getPlanets();
  setPlanets(newPlanets);
    
  console.log(`🪐 ${role} 행성 추가됨 (ID: ${planetId})`);
  };

  // 행성 속성 업데이트
  const updatePlanetProp = (id: string, key: keyof PlanetPhysicalProperties, value: number) => {
  const success = stellarSystem.updatePlanetProperty(id, key, value);
    
    if (success) {
      // UI 상태 업데이트
      setPlanets(prev => prev.map(planet => 
        planet.id === id 
          ? { ...planet, properties: { ...planet.properties, [key]: value } }
          : planet
      ));
      
      console.log(`🪐 ${id}의 ${key} 속성이 ${value}로 업데이트됨`);
    }
  };

  // 행성 패턴 토글
  const togglePattern = async (id: string) => {
  const isNowPlaying = await stellarSystem.togglePlanetPattern(id);
    
    // UI 상태 업데이트
    setPlanets(prev => prev.map(planet => 
      planet.id === id 
        ? { ...planet, isPlaying: isNowPlaying }
        : planet
    ));
    
    const planet = planets.find(p => p.id === id);
    console.log(`${planet?.name} 패턴 ${isNowPlaying ? '시작' : '정지'}됨`);
  };

  // 행성 삭제
  const removePlanet = (id: string) => {
  const success = stellarSystem.removePlanet(id);
    
    if (success) {
      // UI 상태 업데이트
      setPlanets(prev => prev.filter(planet => planet.id !== id));
    }
  };

  // 모든 패턴 정지
  const stopAllPatterns = () => {
  stellarSystem.stopAllPatterns();
    
    // UI 상태 업데이트
    setPlanets(prev => prev.map(planet => ({ ...planet, isPlaying: false })));
  };

  // 항성 속성 업데이트
  const updateStarProperty = (property: 'spin' | 'brightness' | 'color' | 'size', value: number) => {
  stellarSystem.updateStarProperty(property, value);
    
    // UI 상태 업데이트
    setStarProperties(prev => ({ ...prev, [property]: value }));
    
    // 전역 상태도 업데이트
  const newGlobalState = stellarSystem.getStarGlobalState();
    setStarGlobalState(newGlobalState);
    
    console.log(`⭐ 항성 ${property} → ${value} | 전역: ${JSON.stringify(newGlobalState)}`);
  };

  // 속성별 사운드 매핑 정보를 반환하는 함수 (새로운 Tri Hybrid + Dual 시스템)
  const getSoundMappingInfo = (propName: keyof PlanetPhysicalProperties): string[] => {
    switch (propName) {
      // === Tri(Hybrid) 매핑 - 음색 중심 속성 (1→3) ===
      case 'color':
        return ['Wavetable Index', 'Tone Tint (sigmoid)', 'Wavefold Amount (0.0-0.6)'];
      case 'brightness':
        return ['Filter Cutoff (800-16kHz)', 'Output Gain (-6 to 0dB)', 'Resonance Q (0.2-0.7)'];
      case 'distance':  
        return ['Reverb Send (role-based)', 'Delay Beats (0.25-1.5)', 'Reverb Size (0.2-0.9)'];
      case 'tilt':
        return ['Pan (-0.6 to 0.6)', 'MS Blend (0.3-0.7)', 'Stereo Width (0.2-1.0)'];
      case 'spin':
        return ['Tremolo Rate (0.5-8Hz)', 'Tremolo Depth (0.1-0.4)', 'Chorus Depth (0.05-0.5)'];
        
      // === Dual 매핑 - 멜로디·패턴 중심 속성 (1→2) ===
      case 'size':
        return ['Pitch Offset (±7 semitones)', 'Note Range Width (5-19 semitones)'];
      case 'elevation':
        return ['Octave Shift (±1)', 'Filter Type Morph (LP→BP→HP)'];
        
      // === Pattern 도메인 전용 ===
      case 'speed':
        return ['Pattern Rate (1/8-1/1)', 'Pattern Pulses (2-16)'];
      case 'eccentricity':
        return ['Swing Percentage (0-40%)', 'Accent Volume (0-2dB)'];
      case 'phase':
        return ['Pattern Rotation (0-15)', 'Quarter Accent Gate'];
        
      default:
        return ['사운드 매핑 정보 없음'];
    }
  };

  // 속성별 패턴 매핑 정보를 반환하는 함수 (새로운 도메인 분리)
  const getPatternMappingInfo = (propName: keyof PlanetPhysicalProperties): string[] => {
    switch (propName) {
      // === 패턴 도메인 필수 속성 ===
      case 'speed':
        return ['Rate/Density (1/8-1/1)', 'Pulses (2-16)'];
      case 'phase':
        return ['Rotation (0-15)', 'Quarter Accent Gate'];
      case 'eccentricity':
        return ['Swing/Accent (0-40%)', 'Groove Feel (0-2dB)'];
        
      // === 패턴 도메인 선택 속성 ===
      case 'brightness':
        return ['Velocity Base', 'Note Intensity'];
      case 'distance':
        return ['Gate Length (0.35-0.85)', 'Note Duration'];
      case 'color':
        return ['Pattern Family Weight', 'Style Preference (Euclid/Backbeat)'];
      case 'spin':
        return ['Variation Cycle', 'Pattern Mutation (Seeded 모드)'];
      case 'tilt':
        return ['Humanize Timing (±ms)', 'Micro-timing Variation'];
        
      // === 비-패턴 도메인 ===
      case 'size':
      case 'elevation':
        return ['Pitch 도메인 (패턴 영향 없음)'];
        
      default:
        return [];
    }
  };

  // 도메인별 색상 코딩
  const getDomainColor = (propName: keyof PlanetPhysicalProperties): string => {
    if (['speed', 'phase', 'eccentricity'].includes(propName)) {
      return 'text-yellow-300'; // Pattern 도메인
    } else if (['size', 'elevation'].includes(propName)) {
      return 'text-green-300'; // Pitch 도메인
    } else if (['color', 'brightness', 'distance', 'tilt', 'spin'].includes(propName)) {
      return 'text-blue-300'; // Sound 도메인
    }
    return 'text-gray-300';
  };

  // 사용 가능한 악기 역할 목록
  const instrumentRoles: InstrumentRole[] = ['DRUM', 'BASS', 'CHORD', 'MELODY', 'ARPEGGIO', 'PAD'];

  return (
    <div className="p-4 space-y-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold text-center">🌌 SONA Audio Test Panel</h2>
  <p className="text-center text-gray-400 text-sm">새로운 StellarSystem 아키텍처 기반 | Tri Hybrid + Dual 매핑</p>
      
      {/* 도메인 구분 안내 */}
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
        <h3 className="text-sm font-semibold mb-2">🎨 SONA 매핑 도메인 구분</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-yellow-300">
            <strong>📊 Pattern:</strong> Speed, Phase, Eccentricity
          </div>
          <div className="text-green-300">
            <strong>🎵 Pitch:</strong> Size, Elevation
          </div>
          <div className="text-blue-300">
            <strong>🔊 Sound:</strong> Color, Brightness, Distance, Tilt, Spin
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Tri(Hybrid): 1속성→3파라미터 | Dual: 1속성→2파라미터 | 도메인 배타 제어
        </p>
      </div>

      {/* 새로운 패턴 변화 안내 */}
      <div className="bg-gray-800 p-3 rounded-lg border border-yellow-400">
        <h3 className="text-sm font-semibold mb-2 text-yellow-400">🎯 패턴 변화 시스템 (Euclidean 기반)</h3>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="text-yellow-300">
            <strong>⚡ Speed:</strong> 패턴 레이트(1/8-1/1) + 펄스 개수(2-16) → 밀도와 빠르기 제어
          </div>
          <div className="text-yellow-300">
            <strong>🌙 Phase:</strong> 패턴 회전(0-15) + 액센트 게이트(quarters) → 패턴 시작점과 강조점 제어
          </div>
          <div className="text-yellow-300">
            <strong>🎭 Eccentricity:</strong> 스윙(0-40%) + 액센트 강도(0-2dB) → 그루브감과 다이나믹 제어
          </div>
          <div className="text-blue-300 mt-1">
            <strong>📏 Distance:</strong> 노트 지속시간(0.35-0.85) → 스타카토/레가토 제어
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          ✨ 이제 각 행성의 패턴이 Euclidean 알고리즘으로 동적 생성됩니다!
        </p>
      </div>
      
      {/* 오디오 상태 및 초기화 */}
      <div className="text-center bg-gray-800 p-4 rounded-lg">
        <div className="mb-3">
          <p className="mb-2">
            StellarSystem: 
            <span className={`ml-2 px-2 py-1 rounded ${
              engineReady 
                ? 'bg-green-600 text-white' 
                : 'bg-yellow-600 text-black'
            }`}>
              {engineReady ? 'Ready' : 'Not Ready'}
            </span>
          </p>
        </div>
        
        {!engineReady && (
          <div className="space-y-2">
            <button
              onClick={initAudio}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
            >
              🌌 SONA StellarSystem 시작
            </button>
            <p className="text-sm text-gray-400">
              브라우저 정책상 사용자 클릭 후에만 오디오를 시작할 수 있습니다
            </p>
          </div>
        )}
        
        {engineReady && (
          <div className="text-green-400">
            ✅ StellarSystem이 준비되었습니다! 행성을 추가하고 패턴을 재생해보세요.
          </div>
        )}
      </div>

      {/* 항성(전역) 설정 패널 */}
      <div className="bg-gray-800 p-4 rounded-lg border border-yellow-500">
        <h3 className="text-lg font-semibold mb-3 text-yellow-400">⭐ 항성 (전역 설정)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Spin → BPM */}
          <div>
            <label className="block mb-1 text-sm">Spin: {starProperties.spin} → BPM: {starGlobalState.bpm}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={starProperties.spin}
              onChange={(e) => updateStarProperty('spin', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-blue-300 mt-1">Spin → BPM (60-180)</div>
          </div>

          {/* Brightness → Volume */}
          <div>
            <label className="block mb-1 text-sm">Brightness: {starProperties.brightness} → Volume: {starGlobalState.volume}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={starProperties.brightness}
              onChange={(e) => updateStarProperty('brightness', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-blue-300 mt-1">Brightness → Volume (0-100)</div>
          </div>

          {/* Color → Key/Scale */}
          <div>
            <label className="block mb-1 text-sm">Color: {starProperties.color}° → {starGlobalState.key} {starGlobalState.scale}</label>
            <input
              type="range"
              min="0"
              max="360"
              value={starProperties.color}
              onChange={(e) => updateStarProperty('color', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-blue-300 mt-1">Color → Key/Scale</div>
          </div>

          {/* Size → Complexity */}
          <div>
            <label className="block mb-1 text-sm">Size: {starProperties.size} → Complexity: {starGlobalState.complexity}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={starProperties.size}
              onChange={(e) => updateStarProperty('size', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-blue-300 mt-1">Size → Complexity (1-3)</div>
          </div>
        </div>
      </div>

      {/* 행성 추가 버튼들 */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🪐 행성 추가 (악기 선택)</h3>
        <div className="grid grid-cols-3 gap-2">
          {instrumentRoles.map(role => (
            <button
              key={role}
              onClick={() => addPlanet(role)}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-sm"
              disabled={!engineReady}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 전역 컨트롤 */}
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

      {/* 행성 목록 */}
      <div className="space-y-3">
        {planets.map(planet => (
          <div 
            key={planet.id} 
            className="p-3 border border-gray-700 rounded-lg bg-gray-800"
          >
            {/* 행성 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{planet.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                  {planet.role}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  planet.isPlaying 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-white'
                }`}>
                  {planet.isPlaying ? '▶️ 재생중' : '⏸️ 정지'}
                </span>
              </div>
              
              {/* 행성 컨트롤 버튼들 */}
              <div className="flex gap-2">
                <button
                  onClick={() => togglePattern(planet.id)}
                  className={`px-3 py-1 rounded transition-colors ${
                    planet.isPlaying
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-blue-600 hover:bg-blue-700'
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

            {/* 행성 속성 슬라이더들 */}
            <div className="grid grid-cols-1 gap-4 text-sm">
              {/* Size 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Size: {planet.properties.size.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.properties.size}
                  onChange={(e) => updatePlanetProp(planet.id, 'size', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('size')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('size').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('size').join(' • ')}</div>
                </div>
              </div>

              {/* Brightness 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Brightness: {planet.properties.brightness.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.properties.brightness}
                  onChange={(e) => updatePlanetProp(planet.id, 'brightness', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('brightness')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('brightness').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('brightness').join(' • ')}</div>
                </div>
              </div>

              {/* Distance 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Distance: {planet.properties.distance.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.properties.distance}
                  onChange={(e) => updatePlanetProp(planet.id, 'distance', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('distance')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('distance').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('distance').join(' • ')}</div>
                </div>
              </div>

              {/* Speed 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Speed: {planet.properties.speed.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.properties.speed}
                  onChange={(e) => updatePlanetProp(planet.id, 'speed', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('speed')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('speed').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('speed').join(' • ')}</div>
                </div>
              </div>

              {/* Spin 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Spin: {planet.properties.spin.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.properties.spin}
                  onChange={(e) => updatePlanetProp(planet.id, 'spin', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('spin')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('spin').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('spin').join(' • ')}</div>
                </div>
              </div>

              {/* Eccentricity 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Eccentricity: {planet.properties.eccentricity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.properties.eccentricity}
                  onChange={(e) => updatePlanetProp(planet.id, 'eccentricity', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('eccentricity')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('eccentricity').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('eccentricity').join(' • ')}</div>
                </div>
              </div>

              {/* Color 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Color: {planet.properties.color.toFixed(1)}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={planet.properties.color}
                  onChange={(e) => updatePlanetProp(planet.id, 'color', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('color')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('color').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('color').join(' • ')}</div>
                </div>
              </div>

              {/* Tilt 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Tilt: {planet.properties.tilt.toFixed(1)}°</label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="1"
                  value={planet.properties.tilt}
                  onChange={(e) => updatePlanetProp(planet.id, 'tilt', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('tilt')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('tilt').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('tilt').join(' • ')}</div>
                </div>
              </div>

              {/* Elevation 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Elevation: {planet.properties.elevation.toFixed(1)}°</label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="1"
                  value={planet.properties.elevation}
                  onChange={(e) => updatePlanetProp(planet.id, 'elevation', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('elevation')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('elevation').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('elevation').join(' • ')}</div>
                </div>
              </div>

              {/* Phase 슬라이더 */}
              <div className="border border-gray-600 p-3 rounded">
                <label className="block mb-1 font-semibold">Phase: {planet.properties.phase.toFixed(1)}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={planet.properties.phase}
                  onChange={(e) => updatePlanetProp(planet.id, 'phase', parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className={`text-xs ${getDomainColor('phase')}`}>
                  <div className="mb-1"><strong>🎵 Sound:</strong> {getSoundMappingInfo('phase').join(' • ')}</div>
                  <div><strong>🎼 Pattern:</strong> {getPatternMappingInfo('phase').join(' • ')}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 행성이 없는 경우 안내 메시지 */}
      {planets.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>🌟 위에서 악기 역할을 선택해 첫 번째 행성을 추가해보세요!</p>
          <p className="text-sm mt-2">각 행성은 선택한 악기 역할을 가지며, 속성을 조절해 사운드를 변경할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default AudioTestPanel;
