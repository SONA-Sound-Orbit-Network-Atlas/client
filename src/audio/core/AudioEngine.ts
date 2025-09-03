// AudioEngine - 저수준 Tone.js 제어 서비스
// 상태를 갖지 않고, Star나 StellarSystem으로부터 값을 직접 전달받아 Tone.js를 제어합니다.
// 단일 진실 공급원(Single Source of Truth): Star.ts가 모든 전역 상태를 관리

import * as Tone from 'tone';
import { generatePattern } from '../utils/pattern';
import { quantizeToScale } from '../utils/scale';
import type { PatternParameters, GeneratedPattern, StarGlobalState, KeyName, ScaleName } from '../../types/audio';

export class AudioEngine {
  private static _instance: AudioEngine | null = null;
  private _initialized = false;
  
  // 패턴 루프 관리
  private activeLoops: Tone.Loop[] = [];
  private barCounter = 0;
  private measureEventId: number | null = null;
  
  // 이펙트 버스 (전역 공유)
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  
  // 루프 메타데이터 (재롤링, 스윙 등)
  private loopMetadata = new WeakMap<Tone.Loop, {
    patternParams: PatternParameters;
    pattern: GeneratedPattern;
    lastRerollBar: number;
  }>();

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

  // 패턴 루프 생성 (복잡도를 매개변수로 받음)
  createPatternLoop(
    params: PatternParameters, 
    complexity: number,
    trigger: (stepIdx: number, accent: boolean, time: number) => void
  ): Tone.Loop {
    // 복잡도(Complexity)에 따른 pulses 가중
    const complexityFactor = 1 + 0.25 * (complexity - 1); // 1, 1.25, 1.5
    const adjustedParams: PatternParameters = {
      ...params,
      pulses: Math.min(
        Math.max(1, Math.round(params.pulses * complexityFactor)), 
        params.steps
      )
    };
    
    let pattern = generatePattern(adjustedParams);
    let step = 0;
    
    const loop = new Tone.Loop((time) => {
      // 패턴 재롤링 체크
      const metadata = this.loopMetadata.get(loop);
      if (metadata && 
          metadata.patternParams.barsBetweenReroll && 
          this.barCounter - metadata.lastRerollBar >= metadata.patternParams.barsBetweenReroll) {
        
        pattern = generatePattern(adjustedParams);
        metadata.pattern = pattern;
        metadata.lastRerollBar = this.barCounter;
        console.log('♻️ 패턴 재롤링', { bars: this.barCounter, pulses: pattern.params.pulses });
      }
      
      // 16스텝으로 정규화된 stepIdx 계산
      const stepIdx = step % 16;
      
      // 패턴 내에서 해당 스텝이 활성화되어 있는지 확인
      const patternStep = stepIdx % pattern.steps.length;
      if (pattern.steps[patternStep] === 1) {
        // 개별 스텝 스윙 오프셋 적용 (짝수 16th만)
        let swingTime = time;
        if (adjustedParams.swingPct > 0 && (step % 2 === 1)) {
          const sixteenthDuration = Tone.Time('16n').toSeconds();
          const offset = (adjustedParams.swingPct / 100) * 0.5 * sixteenthDuration;
          swingTime = time + offset;
        }
        
        trigger(stepIdx, pattern.accents[patternStep] === 1, swingTime);
      }
      step++;
    }, '16n');
    
    // 메타데이터 저장
    this.loopMetadata.set(loop, {
      patternParams: adjustedParams,
      pattern,
      lastRerollBar: this.barCounter
    });
    
    this.activeLoops.push(loop);
    return loop;
  }

  // 루프 시작
  startLoop(loop: Tone.Loop): void {
    loop.start(0);
    
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
    
    // 바 카운터 설정 (한 번만)
    if (this.measureEventId === null) {
      this.measureEventId = Tone.Transport.scheduleRepeat(() => {
        this.barCounter++;
      }, '1m');
    }
  }

  // 모든 루프 정지
  stopAllLoops(): void {
    this.activeLoops.forEach(loop => {
      loop.stop();
      loop.dispose();
    });
    this.activeLoops = [];
    
    if (this.measureEventId !== null) {
      Tone.Transport.clear(this.measureEventId);
      this.measureEventId = null;
    }
  }

  // 개별 루프 정리 (삭제 시 사용)
  cleanupLoop(loop: Tone.Loop): void {
    try {
      console.log('🧹 루프 정리 시작:', loop.state);
      
      // 루프가 실행 중이면 정지
      if (loop.state === 'started') {
        loop.stop();
        console.log('🛑 루프 정지됨');
      }
      
      // activeLoops에서 제거
      const index = this.activeLoops.indexOf(loop);
      if (index > -1) {
        this.activeLoops.splice(index, 1);
        console.log('📋 activeLoops에서 제거됨, 남은 루프:', this.activeLoops.length);
      }
      
      // 메타데이터 제거
      this.loopMetadata.delete(loop);
      
      // 루프 폐기
      loop.dispose();
      console.log('🗑️ 루프 폐기됨');
      
      // 모든 루프가 제거되면 Transport 정지
      if (this.activeLoops.length === 0) {
        console.log('🚫 모든 루프 제거됨, Transport 정지');
        Tone.Transport.stop();
        if (this.measureEventId !== null) {
          Tone.Transport.clear(this.measureEventId);
          this.measureEventId = null;
          console.log('📏 측정 이벤트 정리됨');
        }
      }
    } catch (error) {
      console.error('❌ 루프 정리 중 오류:', error);
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

  // 볼륨 값을 dB로 변환
  private dbFromVolume(volume: number): number {
    return (volume / 100) * -6; // 0-100 → 0 to -6dB
  }
}
