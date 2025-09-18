// Star - 항성 시스템 (전역 상태 관리 + 중앙 클락)
// 모든 행성(악기)에 영향을 주는 전역 설정을 관리하고 중앙 클락을 제공합니다.
// SONA 지침: Spin→BPM, Color→Key/Scale, Brightness→Master Tone Character, Size→Complexity

import * as Tone from 'tone';
import type { StarGlobalState, KeyName, ScaleName } from '../../types/audio';
import { AudioEngine } from './AudioEngine';
import { RandomManager, type SeededRng } from '../utils/random';

export class Star {
  private static _instance: Star | null = null;
  
  // 항성의 물리적 속성
  private properties = {
    spin: 50,       // 0-100 → BPM 60-180
    brightness: 70, // 0-100 → Master Tone Character (0-30: Warm, 70-100: Bright)
    color: 0,       // 0-360 → Key/Scale
    size: 50        // 0-100 → Complexity 1-3
  };
  
  // 파생된 전역 상태
  private globalState: StarGlobalState = {
    bpm: 120,
    toneCharacter: 70,
    key: 'C',
    scale: 'Major',
    complexity: 2
  };
  
  // === 중앙 클락 시스템 ===
  private globalClock: Tone.Loop | null = null;
  private clockListeners: Map<string, (beat: number, bar: number, sixteenth: number, time: number) => void> = new Map();
  private currentBeat = 0;       // 현재 박자 (1박 = quarter note)
  private currentBar = 0;        // 현재 마디 
  private currentSixteenth = 0;  // 현재 16분음표 (0-15)
  private isClockRunning = false;
  
  // 클락 이벤트 콜백
  private onClockTick?: (beat: number, bar: number, sixteenth: number) => void;
  
  // === Seed 기반 랜덤 관리 ===
  private seed: number | string | null = null;
  private randomManager: RandomManager = new RandomManager();
  
  // 음계 매핑 테이블
  private readonly scaleMap = {
    'Major': [0, 2, 4, 5, 7, 9, 11],
    'Minor': [0, 2, 3, 5, 7, 8, 10],
    'Dorian': [0, 2, 3, 5, 7, 9, 10],
    'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'Lydian': [0, 2, 4, 6, 7, 9, 11],
    'Phrygian': [0, 1, 3, 5, 7, 8, 10],
    'Locrian': [0, 1, 3, 5, 6, 8, 10]
  };
  
  // 키 매핑 (12등분)
  private readonly keyMap: KeyName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  private constructor() {
    this.updateGlobalState();
    this.initializeClock();
  }
  
  // 싱글톤 패턴
  static get instance(): Star {
    if (!this._instance) {
      this._instance = new Star();
    }
    return this._instance;
  }
  
  // === 중앙 클락 관리 ===
  
  // 클락 초기화 (16분음표 기준으로 정확한 타이밍 제공)
  private initializeClock(): void {
    this.globalClock = new Tone.Loop((time) => {
      // 16분음표마다 호출됨 (가장 세밀한 타이밍 단위)
      this.currentSixteenth = (this.currentSixteenth + 1) % 16;
      
      // 새로운 박자 시작 (4분음표마다)
      if (this.currentSixteenth % 4 === 0) {
        this.currentBeat = (this.currentBeat + 1) % 4;
      }
      
      // 새로운 마디 시작 (16분음표 16개마다)
      if (this.currentSixteenth === 0) {
        this.currentBar++;
      }
      
      // 등록된 모든 리스너에게 클락 이벤트 전송
      this.clockListeners.forEach((callback) => {
        try {
          callback(this.currentBeat, this.currentBar, this.currentSixteenth, time);
        } catch (error) {
          console.error('🕐 클락 리스너 오류:', error);
        }
      });
      
      // 전역 클락 틱 콜백 실행
      if (this.onClockTick) {
        this.onClockTick(this.currentBeat, this.currentBar, this.currentSixteenth);
      }
      
    }, '16n'); // 16분음표마다 실행
    
    console.log('🕐 Star 중앙 클락 초기화 완료');
  }
  
  // 클락 시작
  startClock(): void {
    if (!this.globalClock || this.isClockRunning) return;
    
    // Transport가 시작되지 않았다면 시작
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
    
    this.globalClock.start(0);
    this.isClockRunning = true;
    
    console.log('▶️ Star 중앙 클락 시작');
  }
  
  // 클락 정지
  stopClock(): void {
    if (!this.globalClock || !this.isClockRunning) return;
    
    this.globalClock.stop();
    this.isClockRunning = false;
    
    // 클락 상태 리셋
    this.currentBeat = 0;
    this.currentBar = 0;
    this.currentSixteenth = 0;
    
    console.log('⏹️ Star 중앙 클락 정지');
  }
  
  // 클락 리스너 등록 (Planet에서 사용)
  addClockListener(id: string, callback: (beat: number, bar: number, sixteenth: number, time: number) => void): void {
    this.clockListeners.set(id, callback);
    console.log(`🕐 클락 리스너 등록: ${id} (총 ${this.clockListeners.size}개)`);
  }
  
  // 클락 리스너 제거
  removeClockListener(id: string): void {
    if (this.clockListeners.delete(id)) {
      console.log(`🕐 클락 리스너 제거: ${id} (남은 ${this.clockListeners.size}개)`);
    }
    
    // 모든 리스너가 제거되면 클락 정지
    if (this.clockListeners.size === 0) {
      this.stopClock();
    }
  }
  
  // 현재 클락 상태 반환
  getClockState(): { beat: number; bar: number; sixteenth: number; isRunning: boolean } {
    return {
      beat: this.currentBeat,
      bar: this.currentBar,
      sixteenth: this.currentSixteenth,
      isRunning: this.isClockRunning
    };
  }
  
  // 클락 틱 콜백 설정 (디버깅용)
  setClockTickCallback(callback: (beat: number, bar: number, sixteenth: number) => void): void {
    this.onClockTick = callback;
  }
  
  // 항성 속성 업데이트 (SONA 매핑 적용)
  updateProperty(property: keyof typeof this.properties, value: number): void {
    this.properties[property] = value;
    this.updateGlobalState();
    
    // AudioEngine에 전역 상태 적용
    const audioEngine = AudioEngine.instance;
    if (audioEngine.isReady()) {
      audioEngine.applyGlobalState(this.globalState);
      
      // BPM 변경 시 Transport 업데이트
      if (property === 'spin') {
        Tone.Transport.bpm.rampTo(this.globalState.bpm, 0.5);
      }
    }
    
    console.log(`⭐ Star ${property} → ${value} | Global State:`, this.globalState);
  }
  
  // 전체 속성 업데이트
  updateProperties(props: Partial<typeof this.properties>): void {
    Object.assign(this.properties, props);
    this.updateGlobalState();
    
    const audioEngine = AudioEngine.instance;
    if (audioEngine.isReady()) {
      audioEngine.applyGlobalState(this.globalState);
      
      // BPM 변경이 포함된 경우 Transport 업데이트
      if ('spin' in props) {
        Tone.Transport.bpm.rampTo(this.globalState.bpm, 0.5);
      }
    }
  }

  // 전역 상태 직접 업데이트 (StellarSystem용)
  setGlobalState(newState: Partial<StarGlobalState>): void {
    Object.assign(this.globalState, newState);
    
    const audioEngine = AudioEngine.instance;
    if (audioEngine.isReady()) {
      audioEngine.applyGlobalState(this.globalState);
      
      // BPM 변경 시 Transport 업데이트
      if ('bpm' in newState) {
        Tone.Transport.bpm.rampTo(this.globalState.bpm, 0.5);
      }
    }
    
    console.log(`⭐ Star Global State 직접 업데이트:`, this.globalState);
  }
  
  // SONA 매핑에 따른 전역 상태 계산
  private updateGlobalState(): void {
    // Spin → BPM (60-180)
    this.globalState.bpm = Math.round(60 + (this.properties.spin / 100) * 120);
    
    // Brightness → Master Tone Character (0-100)
    // 0-30: Warm/Dark, 30-70: Balanced, 70-100: Bright/Sharp
    this.globalState.toneCharacter = this.properties.brightness;
    
    // Size → Complexity (1-3)
    this.globalState.complexity = Math.max(1, Math.min(3, Math.round(1 + (this.properties.size / 100) * 2))) as 1 | 2 | 3;
    
    // Color → Key/Scale (12등분 × 스케일 수)
    const totalCombinations = this.keyMap.length * Object.keys(this.scaleMap).length;
    const colorIndex = Math.floor((this.properties.color / 360) * totalCombinations);
    
    const keyIndex = colorIndex % this.keyMap.length;
    const scaleIndex = Math.floor(colorIndex / this.keyMap.length) % Object.keys(this.scaleMap).length;
    
    this.globalState.key = this.keyMap[keyIndex];
    this.globalState.scale = Object.keys(this.scaleMap)[scaleIndex] as ScaleName;
  }
  
  // 현재 전역 상태 반환
  getGlobalState(): StarGlobalState {
    return { ...this.globalState };
  }
  
  // 현재 속성 반환
  getProperties() {
    return { ...this.properties };
  }
  
  // 스케일 정보 반환
  getScaleNotes(): number[] {
    return this.scaleMap[this.globalState.scale];
  }
  
  // 키 정보 반환 (MIDI 번호)
  getKeyRoot(): number {
    const keyIndex = this.keyMap.indexOf(this.globalState.key);
    return keyIndex >= 0 ? keyIndex : 0; // C = 0
  }
  
  // 노트를 현재 키/스케일로 양자화
  quantizeNote(midiNote: number): number {
    const scaleNotes = this.getScaleNotes();
    const keyRoot = this.getKeyRoot();
    
    // 옥타브와 크로마틱 분리
    const octave = Math.floor(midiNote / 12);
    const chromatic = midiNote % 12;
    
    // 키 오프셋 적용
    const adjustedChromatic = (chromatic - keyRoot + 12) % 12;
    
    // 가장 가까운 스케일 노트 찾기
    let closestScaleNote = scaleNotes[0];
    let minDistance = Math.abs(adjustedChromatic - scaleNotes[0]);
    
    for (const scaleNote of scaleNotes) {
      const distance = Math.abs(adjustedChromatic - scaleNote);
      if (distance < minDistance) {
        minDistance = distance;
        closestScaleNote = scaleNote;
      }
    }
    
    // 양자화된 MIDI 노트 반환
    return octave * 12 + (closestScaleNote + keyRoot) % 12;
  }
  
  // 리소스 정리
  dispose(): void {
    this.stopClock();
    this.clockListeners.clear();
    
    if (this.globalClock) {
      this.globalClock.dispose();
      this.globalClock = null;
    }
    
    console.log('🗑️ Star 정리 완료');
  }
  
  // 디버그 정보 출력
  debug(): void {
    console.log('⭐ Star Debug Info:');
    console.log('Properties:', this.properties);
    console.log('Global State:', this.globalState);
    console.log('Clock State:', this.getClockState());
    console.log('Scale Notes:', this.getScaleNotes());
    console.log('Key Root MIDI:', this.getKeyRoot());
    console.log('Active Listeners:', this.clockListeners.size);
  }
  
  // === Seed 기반 랜덤 관리 ===
  
  // 시드 설정 (전체 음악 우주의 초기 조건 설정)
  setSeed(seed: number | string): void {
    this.seed = seed;
    this.randomManager.setSeed(seed);
    console.log(`🌱 Star Seed 설정: ${seed}`);
  }
  
  // 현재 시드 반환
  getSeed(): number | string | null {
    return this.seed;
  }
  
  // 도메인별 랜덤 생성기 반환 (Planet, Pattern 등에서 사용)
  getDomainRng(domain: string): SeededRng {
    return this.randomManager.getDomainRng(domain);
  }
  
  // 전역 랜덤 함수들 (편의 메서드)
  nextFloat(): number {
    return this.randomManager.nextFloat();
  }
  
  nextInt(min: number, max: number): number {
    return this.randomManager.nextInt(min, max);
  }
  
  choice<T>(arr: T[]): T {
    return this.randomManager.choice(arr);
  }
}
