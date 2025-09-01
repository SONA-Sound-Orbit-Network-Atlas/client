// Star - 항성 시스템 (전역 상태 관리)
// 모든 행성(악기)에 영향을 주는 전역 설정을 관리합니다.
// SONA 지침: Spin→BPM, Color→Key/Scale, Brightness→Volume, Size→Complexity

import type { StarGlobalState, KeyName, ScaleName } from '../../types/audio';
import { AudioEngine } from './AudioEngine';

export class Star {
  private static _instance: Star | null = null;
  
  // 항성의 물리적 속성
  private properties = {
    spin: 50,       // 0-100 → BPM 60-180
    brightness: 70, // 0-100 → Volume 0-100  
    color: 0,       // 0-360 → Key/Scale
    size: 50        // 0-100 → Complexity 1-3
  };
  
  // 파생된 전역 상태
  private globalState: StarGlobalState = {
    bpm: 120,
    volume: 70,
    key: 'C',
    scale: 'Major',
    complexity: 2
  };
  
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
  }
  
  // 싱글톤 패턴
  static get instance(): Star {
    if (!this._instance) {
      this._instance = new Star();
    }
    return this._instance;
  }
  
  // 항성 속성 업데이트 (SONA 매핑 적용)
  updateProperty(property: keyof typeof this.properties, value: number): void {
    this.properties[property] = value;
    this.updateGlobalState();
    
    // AudioEngine에 즉시 반영
    const audioEngine = AudioEngine.instance;
    if (audioEngine.isReady()) {
      audioEngine.updateStar(this.globalState);
    }
    
    console.log(`⭐ Star ${property} → ${value} | Global State:`, this.globalState);
  }
  
  // 전체 속성 업데이트
  updateProperties(props: Partial<typeof this.properties>): void {
    Object.assign(this.properties, props);
    this.updateGlobalState();
    
    const audioEngine = AudioEngine.instance;
    if (audioEngine.isReady()) {
      audioEngine.updateStar(this.globalState);
    }
  }
  
  // SONA 매핑에 따른 전역 상태 계산
  private updateGlobalState(): void {
    // Spin → BPM (60-180)
    this.globalState.bpm = Math.round(60 + (this.properties.spin / 100) * 120);
    
    // Brightness → Volume (0-100)
    this.globalState.volume = this.properties.brightness;
    
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
  
  // 디버그 정보 출력
  debug(): void {
    console.log('⭐ Star Debug Info:');
    console.log('Properties:', this.properties);
    console.log('Global State:', this.globalState);
    console.log('Scale Notes:', this.getScaleNotes());
    console.log('Key Root MIDI:', this.getKeyRoot());
  }
}
