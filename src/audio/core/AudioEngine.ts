// AudioEngine - 저수준 Tone.js 제어 서비스 (새로운 파라미터 시스템 적용)
// 상태를 갖지 않고, Star나 StellarSystem으로부터 값을 직접 전달받아 Tone.js를 제어합니다.
// 단일 진실 공급원(Single Source of Truth): Star.ts가 모든 전역 상태를 관리
// 새로운 파라미터 범위: planetSize, planetColor, planetBrightness, distanceFromStar, 
// orbitSpeed, rotationSpeed, inclination, eccentricity, tilt

import * as Tone from 'tone';
import { quantizeToScale } from '../utils/scale';
import type { StarGlobalState, KeyName, ScaleName } from '../../types/audio';

export class AudioEngine {
  private static _instance: AudioEngine | null = null;
  private _initialized = false;
  // 마스터 볼륨(0~100)을 내부적으로 dB로 변환하여 Tone.Destination.volume에 적용
  private _masterVolume = 70; // UI 기준 퍼센트 보관 (기본 70)
  
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
      // 볼륨은 플레이어에서 별도 관리하므로 기본값 설정
      this.setMasterVolume(this._masterVolume); // 기본 볼륨(퍼센트)을 dB로 반영
      this.applyToneCharacter(initialState.toneCharacter);
    } else {
      // 기본 설정
      Tone.Transport.bpm.value = 120;
      this.setMasterVolume(this._masterVolume);
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
    
    // Transport에 BPM만 반영 (볼륨은 플레이어에서 별도 처리)
    Tone.Transport.bpm.rampTo(state.bpm, 0.2);
    
    // 전역 톤 캐릭터 적용 (필터나 마스터 이펙트로 구현 가능)
    this.applyToneCharacter(state.toneCharacter);
  }

  // 마스터 볼륨 제어: 0~100(퍼센트) → dB(-60 ~ 0dB 권장)로 맵핑해 적용
  // 사용처: 패널의 Volume 슬라이더 → AudioEngine.setMasterVolume(percent)
  setMasterVolume(percent: number, rampSeconds: number = 0.15): void {
    // 0~100 클램프
    const p = Math.max(0, Math.min(100, percent));
    this._masterVolume = p;
    // 단순 선형 맵핑: 0 → -60dB, 100 → 0dB
    const db = -60 + (p / 100) * 60;
    if (this._initialized) {
      Tone.Destination.volume.rampTo(db, rampSeconds);
    } else {
      // 초기화 전에는 값만 기억하고, init 시 반영
    }
  }

  getMasterVolume(): number {
    return this._masterVolume;
  }

  // 전역 톤 캐릭터 적용
  private masterFilter: Tone.Filter | null = null;
  private masterEQ: Tone.EQ3 | null = null;

  private ensureMasterChain(): void {
    // 전역 마스터 체인을 한번만 구성 (Filter → EQ → Destination)
    if (!this.masterFilter) {
      this.masterFilter = new Tone.Filter({ type: 'lowpass', frequency: 18000, rolloff: -24 }).toDestination();
    }
    if (!this.masterEQ) {
      this.masterEQ = new Tone.EQ3({ low: 0, mid: 0, high: 0 });
      // Destination 앞단에 체인 구성: Source(각 악기) → Destination
      // 여기서는 Destination.volume만 제어하고, 전역 체인은 버스 개념으로만 사용.
      // 필요 시 각 인스트루먼트가 send 가능한 버스를 별도로 구성할 수 있음.
    }
  }

  private applyToneCharacter(toneCharacter: number): void {
    // toneCharacter 0-100을 전역 음색 특성으로 변환
    // 0-30: Warm/Dark, 30-70: Balanced, 70-100: Bright/Sharp
    this.ensureMasterChain();

    // 정규화 0..1
    const n = Math.max(0, Math.min(100, toneCharacter)) / 100;
    // 컷오프를 200Hz~18kHz 사이로 부드럽게 보간 (어두움 → 낮은 컷오프)
    const cutoff = 200 * Math.pow(18000 / 200, n);
    // 하이 셸프 EQ: 밝을수록 약간 부스트, 어두울수록 컷
    const highShelf = -6 + n * 8; // -6dB .. +2dB
    // 미드 EQ: 밝을수록 약간 얇게(-), 어두울수록 두껍게(+)
    const midEQ = 2 - n * 4; // +2dB .. -2dB

    if (this.masterFilter) {
      this.masterFilter.frequency.rampTo(cutoff, 0.04); // 40ms 슬루
    }
    if (this.masterEQ) {
      this.masterEQ.set({ high: highShelf, mid: midEQ });
    }
  }

  // 노트 양자화 (키/스케일을 매개변수로 받음)
  quantize(noteMidi: number, key: KeyName, scale: ScaleName): number {
    return quantizeToScale(noteMidi, key, scale);
  }

  // 이펙트 노드 반환 (악기에서 사용)
  getEffectNodes() {
    return { reverb: this.reverb, delay: this.delay };
  }
}
