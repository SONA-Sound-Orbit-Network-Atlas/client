import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { AudioEngine } from '../audio/core/AudioEngine';
import type { 
  InstrumentRole, 
  PlanetPhysicalProperties, 
  PatternParameters,
  StarGlobalState,
  KeyName,
  ScaleName 
} from '../types/audio';

// 행성 객체의 인터페이스 정의
interface Planet {
  id: string;
  name: string;
  role: InstrumentRole;
  props: PlanetPhysicalProperties;
  isPlaying: boolean;  // 현재 재생 중인지 여부
  loop?: Tone.Loop;    // Tone.js Loop 객체 (선택적)
  synth?: Tone.Synth | Tone.FMSynth | Tone.MembraneSynth; // 실제 악기 객체
}

// 오디오 테스트 패널 컴포넌트
const AudioTestPanel: React.FC = () => {
  // AudioEngine 인스턴스 가져오기
  const audioEngine = AudioEngine.instance;
  
  // 행성 목록을 관리하는 상태
  const [planets, setPlanets] = useState<Planet[]>([]);
  
  // 오디오 컨텍스트 상태 관리
  const [audioContextState, setAudioContextState] = useState<string>('suspended');
  
  // 엔진 초기화 상태
  const [engineReady, setEngineReady] = useState(false);
  
  // 항성(전역) 설정 상태
  const [starSettings, setStarSettings] = useState<StarGlobalState>({
    bpm: 120,
    volume: 70,
    key: 'C',
    scale: 'Major',
    complexity: 2
  });
  
  // useRef를 사용해 실시간 상태에 접근할 수 있도록 함 (React 클로저 문제 해결)
  const planetsRef = useRef<Planet[]>([]);
  
  // planetsRef를 planets 상태와 동기화
  useEffect(() => {
    planetsRef.current = planets;
  }, [planets]);

  // 오디오 컨텍스트 상태를 주기적으로 확인
  useEffect(() => {
    const checkAudioContext = () => {
      try {
        // AudioContext가 존재할 때만 상태 확인
        if (typeof Tone !== 'undefined' && Tone.getContext) {
          setAudioContextState(Tone.getContext().state);
        }
      } catch (error) {
        // AudioContext 접근 실패 시 suspended로 설정
        setAudioContextState('suspended');
      }
    };

    // 컴포넌트 마운트 시 상태 확인
    checkAudioContext();
    
    // 1초마다 상태 확인
    const interval = setInterval(checkAudioContext, 1000);
    
    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  // 오디오 컨텍스트 및 엔진 초기화 함수
  const initAudio = async () => {
    try {
      console.log('🎵 오디오 초기화 시작...');
      
      // 먼저 Tone.js AudioContext 시작 (사용자 제스처 필요)
      if (Tone.getContext().state !== 'running') {
        console.log('AudioContext 시작 중...');
        await Tone.start();
        console.log('✅ AudioContext 시작됨:', Tone.getContext().state);
      }
      
      // AudioEngine 초기화 (내부적으로 Tone.start() 재호출하지만 안전함)
      console.log('AudioEngine 초기화 중...');
      await audioEngine.init();
      
      // 항성 설정 적용
      console.log('항성 설정 적용 중...');
      audioEngine.updateStar(starSettings);
      
      setEngineReady(true);
      console.log('🎉 SONA AudioEngine 초기화 완료!');
    } catch (error) {
      console.error('❌ 오디오 초기화 실패:', error);
      // 사용자에게 알림
      alert(`오디오 초기화에 실패했습니다: ${error}`);
    }
  };

  // 새로운 행성을 추가하는 함수 (역할을 선택할 수 있음)
  const addPlanet = (role: InstrumentRole) => {
    // 새로운 행성 객체 생성
    const newPlanet: Planet = {
      id: `planet-${Date.now()}`, // 고유 ID 생성
      name: `${role} Planet`,
      role: role,
      props: {
        // 모든 속성을 랜덤 값으로 초기화
        size: Math.random() * 100,
        brightness: Math.random() * 100,
        distance: Math.random() * 100,
        speed: Math.random() * 100,
        spin: Math.random() * 100,
        eccentricity: Math.random() * 100,
        color: Math.random() * 360,
        tilt: (Math.random() - 0.5) * 180,
        elevation: (Math.random() - 0.5) * 180,
        phase: Math.random() * 360,
      },
      isPlaying: false, // 처음에는 재생하지 않음
      synth: createSynthForRole(role), // 역할에 맞는 악기 생성
    };

    // 새로운 행성을 상태에 추가
    setPlanets(prev => [...prev, newPlanet]);
  };

  // 역할에 따른 악기 생성 함수
  const createSynthForRole = (role: InstrumentRole): Tone.Synth | Tone.FMSynth | Tone.MembraneSynth => {
    switch (role) {
      case 'DRUM':
        // 드럼용 멤브레인 신스
        return new Tone.MembraneSynth({
          pitchDecay: 0.01,
          octaves: 6,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
        }).toDestination();
        
      case 'BASS':
        // 베이스용 FM 신스 (낮은 주파수)
        return new Tone.FMSynth({
          harmonicity: 0.25,
          modulationIndex: 2,
          detune: 0,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.4 },
          modulation: { type: 'square' },
          modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
        }).toDestination();
        
      case 'CHORD':
      case 'PAD':
        // 코드/패드용 일반 신스 (부드러운 사운드)
        return new Tone.Synth({
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.8 }
        }).toDestination();
        
      case 'MELODY':
      case 'ARPEGGIO':
      default:
        // 멜로디/아르페지오용 일반 신스
        return new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
        }).toDestination();
    }
  };

  // 역할에 따른 노트 생성 함수
  const generateNoteForRole = (role: InstrumentRole, props: PlanetPhysicalProperties, stepIdx: number): string => {
    // 기본 노트 배열 (C 메이저 스케일)
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    switch (role) {
      case 'DRUM': {
        // 드럼은 고정 노트 (킥드럼 사운드)
        return 'C1';
      }
        
      case 'BASS': {
        // 베이스는 낮은 옥타브 (C1-C2)
        const bassNote = notes[stepIdx % notes.length];
        const bassOctave = 1 + Math.floor((props.size / 100) * 1); // 1-2 옥타브
        return `${bassNote}${bassOctave}`;
      }
        
      case 'CHORD':
      case 'PAD': {
        // 코드/패드는 중간 옥타브 (C3-C4)
        const chordNote = notes[Math.floor((props.color / 360) * notes.length)];
        const chordOctave = 3 + Math.floor((props.elevation + 90) / 180); // 3-4 옥타브
        return `${chordNote}${chordOctave}`;
      }
        
      case 'MELODY':
      case 'ARPEGGIO':
      default: {
        // 멜로디/아르페지오는 높은 옥타브 (C4-C6)
        const melodyNote = notes[(stepIdx + Math.floor(props.phase / 50)) % notes.length];
        const melodyOctave = 4 + Math.floor((props.size / 100) * 2); // 4-6 옥타브
        return `${melodyNote}${melodyOctave}`;
      }
    }
  };

  // 행성 속성을 업데이트하는 함수
  const updatePlanetProp = (id: string, key: keyof PlanetPhysicalProperties, value: number) => {
    setPlanets(prev => prev.map(planet => 
      planet.id === id 
        ? { ...planet, props: { ...planet.props, [key]: value } }
        : planet
    ));
  };

  // 패턴 파라미터를 업데이트하는 함수
  const updatePatternParam = (id: string, key: keyof PatternParameters, value: number) => {
    // 현재는 간단한 매핑만 구현, 향후 확장 예정
    setPlanets(prev => prev.map(planet => 
      planet.id === id 
        ? { ...planet, props: { ...planet.props, speed: value } }
        : planet
    ));
  };

  // 행성 트리거 (원샷 재생)
  const triggerPlanet = (id: string) => {
    const planet = planets.find(p => p.id === id);
    if (planet) {
      console.log(`${planet.name} 트리거됨!`);
      // 향후 원샷 사운드 재생 로직 추가
    }
  };

  // 행성의 패턴을 토글하는 함수 (재생/정지)
  const togglePattern = async (id: string) => {
    // 엔진이 초기화되지 않았다면 초기화
    if (!audioEngine.isReady()) {
      await initAudio();
    }

    setPlanets(prevPlanets => 
      prevPlanets.map(planet => {
        if (planet.id !== id) return planet;

        // 현재 재생 중이라면 정지
        if (planet.isPlaying && planet.loop) {
          try {
            // 기존 루프 정리 (AudioEngine 인스턴스 메서드 사용)
            audioEngine.cleanupLoop(planet.loop);
            
            console.log(`${planet.name} 패턴이 정지되었습니다`);
            
            // 상태 업데이트: 재생 중지, 루프 제거
            return {
              ...planet,
              isPlaying: false,
              loop: undefined
            };
          } catch (error) {
            console.error(`${planet.name} 정지 중 오류:`, error);
            return planet;
          }
        }
        
        // 현재 정지 중이라면 재생 시작
        try {
          // 행성 속성을 패턴 파라미터로 변환
          const patternParams: PatternParameters = {
            pulses: Math.max(2, Math.round((planet.props.speed / 100) * 14 + 2)), // 2-16
            steps: 16,
            rotation: Math.round((planet.props.phase / 360) * 15), // 0-15
            swingPct: Math.min(40, planet.props.eccentricity * 0.4), // 0-40
            accentDb: (planet.props.eccentricity / 100) * 2, // 0-2
            gateLen: 0.35 + (planet.props.distance / 100) * 0.5, // 0.35-0.85
          };

          // AudioEngine을 사용해 새로운 루프 생성
          const newLoop = audioEngine.createPatternLoop(patternParams, (stepIdx, accent, time) => {
            // 루프 콜백에서 실시간 상태 확인 (React 클로저 문제 해결)
            const currentPlanet = planetsRef.current.find(p => p.id === id);
            
            // 행성이 삭제되었거나 더 이상 재생 중이 아니라면 무시
            if (!currentPlanet || !currentPlanet.isPlaying) {
              return; // 경고 로그 없이 조용히 반환
            }
            
            // 실제 오디오 재생 로직
            if (currentPlanet.synth) {
              try {
                // 역할에 따른 노트 생성
                const note = generateNoteForRole(currentPlanet.role, currentPlanet.props, stepIdx);
                const velocity = accent ? 0.8 : 0.5; // 액센트 처리
                const duration = '16n'; // 16분음표 길이
                
                // 드럼의 경우 고정 노트, 다른 악기는 계산된 노트 사용
                if (currentPlanet.role === 'DRUM') {
                  currentPlanet.synth.triggerAttackRelease('C1', duration, time, velocity);
                } else {
                  currentPlanet.synth.triggerAttackRelease(note, duration, time, velocity);
                }
                
                console.log(`${planet.name} [${stepIdx}] ${note} ${accent ? 'ACCENT' : 'normal'}`);
              } catch (error) {
                console.error(`${currentPlanet.name} 재생 오류:`, error);
              }
            }
          });
          
          // 루프 시작 (AudioEngine이 Transport도 관리)
          audioEngine.startLoop(newLoop);
          console.log(`${planet.name} 패턴이 시작되었습니다`);
          
          // 상태 업데이트: 재생 시작, 새 루프 저장
          return {
            ...planet,
            isPlaying: true,
            loop: newLoop
          };
        } catch (error) {
          console.error(`${planet.name} 시작 중 오류:`, error);
          return planet;
        }
      })
    );
  };

  // 행성을 삭제하는 함수
  const removePlanet = (id: string) => {
    // 먼저 해당 행성의 루프를 정리
    planetsRef.current = planetsRef.current.map(p => 
      p.id === id ? { ...p, isPlaying: false } : p
    );
    
    setPlanets(prev => {
      const planet = prev.find(p => p.id === id);
      
      if (planet && planet.loop) {
        try {
          // AudioEngine 인스턴스 메서드로 루프 정리
          audioEngine.cleanupLoop(planet.loop);
          console.log(`${planet.name}의 루프가 정리되었습니다`);
        } catch (error) {
          console.error(`${planet.name} 루프 정리 중 오류:`, error);
        }
      }
      
      // 해당 행성을 제외한 새 배열 반환
      return prev.filter(planet => planet.id !== id);
    });
  };

  // 모든 행성의 패턴을 정지하는 함수
  const stopAllPatterns = () => {
    // AudioEngine의 stopAllLoops 사용
    audioEngine.stopAllLoops();
    
    // 상태도 업데이트
    setPlanets(prevPlanets => 
      prevPlanets.map(planet => ({
        ...planet,
        isPlaying: false,
        loop: undefined
      }))
    );
  };

  // 항성 설정을 업데이트하는 함수
  const updateStarSetting = (key: keyof StarGlobalState, value: any) => {
    const newSettings = { ...starSettings, [key]: value };
    setStarSettings(newSettings);
    
    // AudioEngine에도 즉시 반영
    if (audioEngine.isReady()) {
      audioEngine.updateStar(newSettings);
    }
  };

  // 컴포넌트 언마운트 시 모든 루프 정리
  useEffect(() => {
    return () => {
      audioEngine.stopAllLoops();
    };
  }, [audioEngine]);

  // 사용 가능한 악기 역할 목록
  const instrumentRoles: InstrumentRole[] = ['DRUM', 'BASS', 'CHORD', 'MELODY', 'ARPEGGIO', 'PAD'];

  // 키 목록
  const keys: KeyName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // 스케일 목록
  const scales: ScaleName[] = ['Major', 'Minor', 'Dorian', 'Mixolydian', 'Lydian', 'Phrygian', 'Locrian'];

  return (
    <div className="p-4 space-y-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold text-center">🌌 SONA Audio Test Panel</h2>
      
      {/* 오디오 상태 및 초기화 */}
      <div className="text-center bg-gray-800 p-4 rounded-lg">
        <div className="mb-3">
          <p className="mb-2">
            AudioContext: 
            <span className={`ml-2 px-2 py-1 rounded ${
              audioContextState === 'running' 
                ? 'bg-green-600 text-white' 
                : 'bg-yellow-600 text-black'
            }`}>
              {audioContextState}
            </span>
            {engineReady && (
              <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">Engine Ready</span>
            )}
          </p>
        </div>
        
        {!engineReady && (
          <div className="space-y-2">
            <button
              onClick={initAudio}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
            >
              🎵 SONA 오디오 시작
            </button>
            <p className="text-sm text-gray-400">
              브라우저 정책상 사용자 클릭 후에만 오디오를 시작할 수 있습니다
            </p>
          </div>
        )}
        
        {engineReady && (
          <div className="text-green-400">
            ✅ 오디오 시스템이 준비되었습니다! 행성을 추가하고 패턴을 재생해보세요.
          </div>
        )}
      </div>

      {/* 항성(전역) 설정 패널 */}
      <div className="bg-gray-800 p-4 rounded-lg border border-yellow-500">
        <h3 className="text-lg font-semibold mb-3 text-yellow-400">⭐ 항성 (전역 설정)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* BPM 설정 */}
          <div>
            <label className="block mb-1 text-sm">BPM: {starSettings.bpm}</label>
            <input
              type="range"
              min="60"
              max="180"
              value={starSettings.bpm}
              onChange={(e) => {
                const newSettings = { ...starSettings, bpm: parseInt(e.target.value) };
                setStarSettings(newSettings);
                if (engineReady) {
                  audioEngine.updateStar(newSettings);
                }
              }}
              className="w-full"
            />
          </div>

          {/* 볼륨 설정 */}
          <div>
            <label className="block mb-1 text-sm">Volume: {starSettings.volume}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={starSettings.volume}
              onChange={(e) => {
                const newSettings = { ...starSettings, volume: parseInt(e.target.value) };
                setStarSettings(newSettings);
                if (engineReady) {
                  audioEngine.updateStar(newSettings);
                }
              }}
              className="w-full"
            />
          </div>

          {/* 키 설정 */}
          <div>
            <label className="block mb-1 text-sm">Key: {starSettings.key}</label>
            <select
              value={starSettings.key}
              onChange={(e) => {
                const newSettings = { ...starSettings, key: e.target.value as KeyName };
                setStarSettings(newSettings);
                if (engineReady) {
                  audioEngine.updateStar(newSettings);
                }
              }}
              className="w-full bg-gray-700 text-white rounded p-1"
            >
              {keys.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          {/* 스케일 설정 */}
          <div>
            <label className="block mb-1 text-sm">Scale: {starSettings.scale}</label>
            <select
              value={starSettings.scale}
              onChange={(e) => {
                const newSettings = { ...starSettings, scale: e.target.value as ScaleName };
                setStarSettings(newSettings);
                if (engineReady) {
                  audioEngine.updateStar(newSettings);
                }
              }}
              className="w-full bg-gray-700 text-white rounded p-1"
            >
              {scales.map(scale => (
                <option key={scale} value={scale}>{scale}</option>
              ))}
            </select>
          </div>

          {/* 복잡도 설정 */}
          <div className="col-span-2">
            <label className="block mb-1 text-sm">Complexity: {starSettings.complexity}</label>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={starSettings.complexity}
              onChange={(e) => {
                const newSettings = { ...starSettings, complexity: parseInt(e.target.value) as 1 | 2 | 3 };
                setStarSettings(newSettings);
                if (engineReady) {
                  audioEngine.updateStar(newSettings);
                }
              }}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              1: Simple | 2: Medium | 3: Complex
            </div>
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
            <div className="grid grid-cols-2 gap-3 text-sm">
              {/* Size 슬라이더 */}
              <div>
                <label className="block mb-1">Size: {planet.props.size.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.props.size}
                  onChange={(e) => updatePlanetProp(planet.id, 'size', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Brightness 슬라이더 */}
              <div>
                <label className="block mb-1">Brightness: {planet.props.brightness.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.props.brightness}
                  onChange={(e) => updatePlanetProp(planet.id, 'brightness', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Distance 슬라이더 */}
              <div>
                <label className="block mb-1">Distance: {planet.props.distance.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.props.distance}
                  onChange={(e) => updatePlanetProp(planet.id, 'distance', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Speed 슬라이더 */}
              <div>
                <label className="block mb-1">Speed: {planet.props.speed.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.props.speed}
                  onChange={(e) => updatePlanetProp(planet.id, 'speed', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Spin 슬라이더 */}
              <div>
                <label className="block mb-1">Spin: {planet.props.spin.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.props.spin}
                  onChange={(e) => updatePlanetProp(planet.id, 'spin', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Eccentricity 슬라이더 */}
              <div>
                <label className="block mb-1">Eccentricity: {planet.props.eccentricity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planet.props.eccentricity}
                  onChange={(e) => updatePlanetProp(planet.id, 'eccentricity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Color 슬라이더 */}
              <div>
                <label className="block mb-1">Color: {planet.props.color.toFixed(1)}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={planet.props.color}
                  onChange={(e) => updatePlanetProp(planet.id, 'color', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Tilt 슬라이더 */}
              <div>
                <label className="block mb-1">Tilt: {planet.props.tilt.toFixed(1)}°</label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="1"
                  value={planet.props.tilt}
                  onChange={(e) => updatePlanetProp(planet.id, 'tilt', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Elevation 슬라이더 */}
              <div>
                <label className="block mb-1">Elevation: {planet.props.elevation.toFixed(1)}°</label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="1"
                  value={planet.props.elevation}
                  onChange={(e) => updatePlanetProp(planet.id, 'elevation', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Phase 슬라이더 */}
              <div>
                <label className="block mb-1">Phase: {planet.props.phase.toFixed(1)}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={planet.props.phase}
                  onChange={(e) => updatePlanetProp(planet.id, 'phase', parseFloat(e.target.value))}
                  className="w-full"
                />
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
