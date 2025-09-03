// AudioEngine - 저수준 Tone.js 제어 서비스
// 상태를 갖지 않고, Star나 StellarSystem으로부터 값을 직접 전달받아 Tone.js를 제어합니다.
// 단일 진실 공급원(Single Source of Truth): Star.ts가 모든 전역 상태를 관리

import * as Tone from 'tone';
import { quantizeToScale } from '../utils/scale';
import type { StarGlobalState, KeyName, ScaleName } from '../../types/audio';

export class AudioEngine {
  private static _instance: AudioEngine | null = null;
  private _initialized = false;
  
  // 이펙트 버스 (전역 공유)
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;

  private constructor() {}

  // 싱글톤 인스턴스 반환
  public static get instance(): AudioEngine {
    if (!this._instance) {
      this._instance = new AudioEngine();
    }
    return this._instance;
  }

  // 오디오 엔진 초기화 (사용자 제스처 후 호출 필요)
  async init(initialState?: StarGlobalState): Promise<void> {
    if (this._initialized) return;
    
    await Tone.start();
    
    // Transport 설정 (초기 상태가 있다면 적용)
    if (initialState) {
      Tone.Transport.bpm.value = initialState.bpm;
      Tone.Destination.volume.value = this.dbFromVolume(initialState.volume);
    } else {
      // 기본 설정
      Tone.Transport.bpm.value = 120;
      Tone.Destination.volume.value = this.dbFromVolume(70);
    }
    
    Tone.Transport.swing = 0; // 기본 스윙 0
    Tone.Transport.swingSubdivision = '16n';
    
    // 이펙트 버스 생성
    this.reverb = new Tone.Reverb({
      decay: 3,
      wet: 0.3
    }).toDestination();
    
    this.delay = new Tone.FeedbackDelay('8n', 0.25).toDestination();
    
    this._initialized = true;
    console.log('🔊 AudioEngine 초기화 완료');
  }

  // 초기화 상태 확인
  isReady(): boolean {
    return this._initialized;
  }

  // 전역 상태 적용 (Star에서 직접 호출)
  applyGlobalState(state: StarGlobalState): void {
    if (!this._initialized) return;
    
    // Transport에 즉시 반영
    Tone.Transport.bpm.rampTo(state.bpm, 0.2);
    Tone.Destination.volume.rampTo(this.dbFromVolume(state.volume), 0.3);
  }

  // 노트 양자화 (키/스케일을 매개변수로 받음)
  quantize(noteMidi: number, key: KeyName, scale: ScaleName): number {
    return quantizeToScale(noteMidi, key, scale);
  }

  // 이펙트 노드 반환 (악기에서 사용)
  getEffectNodes() {
    return { reverb: this.reverb, delay: this.delay };
  }

  // 볼륨 값을 dB로 변환
  private dbFromVolume(volume: number): number {
    return (volume / 100) * -6; // 0-100 → 0 to -6dB
  }
}
