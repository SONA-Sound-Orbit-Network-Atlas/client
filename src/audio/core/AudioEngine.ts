// AudioEngine - 저수준 Tone.js 제어 서비스 (새로운 파라미터 시스템 적용)
// 상태를 갖지 않고, Star나 StellarSystem으로부터 값을 직접 전달받아 Tone.js를 제어합니다.
// 단일 진실 공급원(Single Source of Truth): Star.ts가 모든 전역 상태를 관리
// 새로운 파라미터 범위: planetSize, planetColor, planetBrightness, distanceFromStar, 
// orbitSpeed, rotationSpeed, inclination, eccentricity, tilt

import * as Tone from 'tone';
import { quantizeToScale } from '../utils/scale';
import type { StarGlobalState, KeyName, ScaleName } from '../../types/audio';

export class AudioEngine {
  // 마스터 입력 버스 (모든 악기 출력이 여기에 연결됨)
  public masterInput: Tone.Gain | null = null;
  private static _instance: AudioEngine | null = null;
  private _initialized = false;
  // 마스터 볼륨(0~100)을 내부적으로 dB로 변환하여 Tone.Destination.volume에 적용
  private _masterVolume = 60; // UI 기준 퍼센트 보관 (기본 60)
  
  // 이펙트 버스 (전역 공유)
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private _transitioning = false;
  private transitionListeners: Set<(transitioning: boolean) => void> = new Set();
  private volumeListeners: Set<(volume: number) => void> = new Set();

  private constructor() {}

  // 싱글톤 인스턴스 반환
  public static get instance(): AudioEngine {
    if (!this._instance) {
      this._instance = new AudioEngine();
    }
    return this._instance;
  }

  // 오디오 엔진 초기화 (사용자 제스처 후 호출 필요) - 강화된 버전
  async init(initialState?: StarGlobalState): Promise<void> {
    if (this._initialized) {
      // AudioEngine already initialized, skip
      return;
    }
    // AudioEngine initialization start
    
    // 혹시 남아있을 수 있는 이전 상태 정리
    try {
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
      }
    } catch (error) {
      console.warn('초기화 중 Transport 정리 오류:', error);
    }
    
    // 컨텍스트 시작 전 초기 볼륨을 직접 세팅해 첫 소리가 100%로 나오는 것을 방지
    const initDb = -60 + (this._masterVolume / 100) * 60;
    Tone.Destination.volume.value = initDb;
    
    await Tone.start();
  // Tone.js context started
    
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
    
    // 마스터 입력 버스 및 체인 생성
    this.masterInput = new Tone.Gain();
    this.masterEQ = new Tone.EQ3({ low: 0, mid: 0, high: 0 });
    this.masterFilter = new Tone.Filter({ type: 'lowpass', frequency: 18000, rolloff: -24 });
    // masterInput → masterEQ → masterFilter → Tone.Destination
    this.masterInput.chain(this.masterEQ, this.masterFilter, Tone.Destination);

    // 이펙트 버스 생성 (리버브/딜레이는 기존대로 Destination에 연결)
    this.reverb = new Tone.Reverb({ decay: 3, wet: 0.3 }).toDestination();
    this.delay = new Tone.FeedbackDelay('8n', 0.25).toDestination();
    
    this._initialized = true;
    // AudioEngine initialization complete
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
    this.emitVolumeChange();
  }

  getMasterVolume(): number {
    return this._masterVolume;
  }

  // 전역 톤 캐릭터 적용
  private masterFilter: Tone.Filter | null = null;
  private masterEQ: Tone.EQ3 | null = null;

  public ensureMasterChain(): void {
    // masterInput → masterEQ → masterFilter → Tone.Destination
    if (!this.masterInput) {
      this.masterInput = new Tone.Gain();
    }
    if (!this.masterEQ) {
      this.masterEQ = new Tone.EQ3({ low: 0, mid: 0, high: 0 });
    }
    if (!this.masterFilter) {
      this.masterFilter = new Tone.Filter({ type: 'lowpass', frequency: 18000, rolloff: -24 });
    }
    this.masterInput.chain(this.masterEQ, this.masterFilter, Tone.Destination);
  }

  // 이펙트 버스가 필요할 때 항상 존재하도록 보장
  private ensureEffects(): void {
    if (!this.reverb) {
      this.reverb = new Tone.Reverb({ decay: 3, wet: 0.3 }).toDestination();
    }
    if (!this.delay) {
      this.delay = new Tone.FeedbackDelay('8n', 0.25).toDestination();
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
    this.ensureEffects();
    return { reverb: this.reverb, delay: this.delay };
  }

  
    async fadeOutAndStop(rampSeconds: number = 0.6): Promise<void> {
  // AudioEngine.fadeOutAndStop start (rampSeconds=${rampSeconds})

      // 가능한 경우 항상 페이드를 시도합니다. 초기화 여부에 따라 건너뛰지 않도록 안전하게 처리합니다.
      try {
        if (typeof Tone !== 'undefined' && Tone.Destination && Tone.Destination.volume && typeof Tone.Destination.volume.rampTo === 'function') {
          try {
            Tone.Destination.volume.rampTo(-60, rampSeconds);
            // ramp가 적용되는 시간을 기다립니다.
            await new Promise((resolve) => setTimeout(resolve, Math.max(0, rampSeconds) * 1000));
          } catch (err) {
            console.warn('AudioEngine: Tone.Destination.volume.rampTo 실패:', err);
          }
        } else {
          // Tone이 준비되지 않은 경우에도 잠시 지연을 두어 UX 상 갑작스러운 끊김을 완화합니다.
          await new Promise((resolve) => setTimeout(resolve, (Math.max(0, rampSeconds) * 1000) / 4));
        }
      } catch (error) {
        console.warn('AudioEngine 페이드 처리 중 오류:', error);
      }

      // 페이드 후 Transport 및 Tone 자원을 정리합니다.
      try {
        Tone.Transport.stop();
        Tone.Transport.cancel(0);

        const context = Tone.getContext?.();
        if (context && context.state === 'running') {
          try {
            // Transport 내부 스케줄을 초기화하기 위해 한 번 더 예약 후 취소합니다.
            Tone.Transport.scheduleRepeat(() => {}, '1m');
            Tone.Transport.cancel(0);
            // AudioEngine: Transport schedule initialization complete
          } catch (err) {
            console.warn('AudioEngine Transport 스케줄 초기화 실패:', err);
          }
        }

        Tone.Transport.off('start');
        Tone.Transport.off('stop');
        Tone.Transport.off('pause');

  // AudioEngine: Transport cleanup complete
      } catch (error) {
        console.warn('Transport 정리 중 오류:', error);
      }
    }

  // 전환 상태 관리 (구독 가능)
  beginTransition(): void {
    if (this._transitioning) return;
    this._transitioning = true;
    this.transitionListeners.forEach((cb) => cb(true));
  }

  endTransition(): void {
    if (!this._transitioning) return;
    this._transitioning = false;
    this.transitionListeners.forEach((cb) => cb(false));
  }

  isTransitioning(): boolean {
    return this._transitioning;
  }

  onTransition(cb: (transitioning: boolean) => void): () => void {
    this.transitionListeners.add(cb);
    return () => this.transitionListeners.delete(cb);
  }

  private emitVolumeChange(): void {
    this.volumeListeners.forEach((cb) => {
      try {
        cb(this._masterVolume);
      } catch (error) {
        console.error('Volume listener error:', error);
      }
    });
  }

  onVolumeChange(cb: (volume: number) => void): () => void {
    this.volumeListeners.add(cb);
    try {
      cb(this._masterVolume);
    } catch (error) {
      console.error('Volume listener error (initial):', error);
    }
    return () => this.volumeListeners.delete(cb);
  }

  // 다른 스텔라로 이동/새 생성 시 오디오 상태 초기화 (강화된 버전)
  reset(): void {
  // AudioEngine reset start
    
    try {
      // Transport 완전히 정지 및 모든 스케줄 취소
      Tone.Transport.stop();
      Tone.Transport.cancel(0);
      
      // Transport 이벤트 리스너 모두 제거
      Tone.Transport.off('start');
      Tone.Transport.off('stop');
      Tone.Transport.off('pause');
      
      // Transport 상태 초기화
      Tone.Transport.position = 0;
      Tone.Transport.bpm.value = 120; // 기본 BPM으로 리셋
      
  // Transport fully reset
    } catch (error) {
      console.warn('Transport 리셋 중 오류:', error);
    }

    // 전역 이펙트/마스터 체인 정리
    try {
      this.reverb?.dispose();
      this.delay?.dispose();
      this.masterFilter?.dispose();
      this.masterEQ?.dispose();
      
  // Effect chain disposed
    } catch (error) {
      console.warn('이펙트 정리 중 오류:', error);
    }

    this.reverb = null;
    this.delay = null;
    this.masterFilter = null;
    this.masterEQ = null;

    // 볼륨을 기본값으로 복원 (다음 시스템에서 정상 재생을 위해)
    try {
      const initDb = -60 + (this._masterVolume / 100) * 60;
      Tone.Destination.volume.value = initDb;
  // Volume restored to default
    } catch (error) {
      console.warn('볼륨 복원 중 오류:', error);
    }

    this.emitVolumeChange();

    // 초기화 플래그 해제: 다음 재생 시 init 재호출
    this._initialized = false;
    
  // AudioEngine reset complete
  }
}
