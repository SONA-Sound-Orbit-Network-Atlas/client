import { AudioEngine } from '../core/AudioEngine';
// DrumInstrument - 드럼/퍼커션 전용 악기 (독립 구현)
// MembraneSynth + NoiseSynth + MetalSynth로 다양한 드럼 사운드를 생성합니다.
// SONA 지침: DRUM 역할 - range 미적용(채널 고정), family는 Backbeat/Clave/Dense16/Sparse 우선

import * as Tone from 'tone';
import type { MappedAudioParameters } from '../../types/audio';
import { AbstractInstrumentBase, clamp01 } from './InstrumentInterface';

export class DrumInstrument extends AbstractInstrumentBase {
  
  // 드럼 전용 신스들 - 각각 다른 드럼 사운드 담당
  private kickSynth!: Tone.MembraneSynth;    // 킥 드럼 - 멤브레인 신스로 깊고 펀치있는 사운드
  private snareSynth!: Tone.NoiseSynth;      // 스네어 드럼 - 노이즈 신스로 크리스프한 사운드
  private hihatSynth!: Tone.MetalSynth;      // 하이햇 - 메탈 신스로 밝고 선명한 사운드
  private tomSynth!: Tone.MembraneSynth;     // 탐 - 다른 설정의 멤브레인 신스
  
  // 드럼 전용 이펙트
  private drumCompressor!: Tone.Compressor;  // 펀치있는 드럼 사운드를 위한 컴프레서
  private drumEQ!: Tone.EQ3;                 // 드럼 전용 3밴드 EQ
  private drumReverb!: Tone.Reverb;          // 드럼에 대한 리버브(병렬 send)
  private drumDelay!: Tone.FeedbackDelay;    // 드럼에 대한 딜레이(병렬 send)
  private drumWide!: Tone.StereoWidener;    // 드럼 스테레오 와이드 컨트롤

  constructor(id: string = 'drum') {
    super('DRUM', id);
    this.initializeInstrument();
  }

  private initializeInstrument(): void {
    // 킥 드럼 설정 - 멤브레인 신스로 깊고 펀치있는 저음
    this.kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,           // 피치 하강 속도
      octaves: 10,                // 피치 하강 범위
      oscillator: { 
        type: 'sine'              // 사인파 - 깨끗한 저음
      },
      envelope: { 
        attack: 0.001,            // 매우 빠른 어택 - 킥의 펀치감
        decay: 0.4,               // 적당한 디케이
        sustain: 0.01,            // 매우 짧은 서스테인
        release: 1.4              // 긴 릴리즈 - 킥의 울림
      }
    });

    // 스네어 드럼 설정 - 노이즈 신스로 크리스프한 사운드
    this.snareSynth = new Tone.NoiseSynth({
      noise: { 
        type: 'white'             // 화이트 노이즈 - 스네어의 특징적 사운드
      },
      envelope: { 
        attack: 0.001,            // 매우 빠른 어택
        decay: 0.13,              // 짧은 디케이 - 스네어의 크랙감
        sustain: 0,               // 서스테인 없음
        release: 0.03             // 매우 짧은 릴리즈
      }
    });

    // 하이햇 설정 - 메탈 신스로 밝고 선명한 사운드
    this.hihatSynth = new Tone.MetalSynth({
      envelope: { 
        attack: 0.001,            // 매우 빠른 어택
        decay: 0.1,               // 짧은 디케이
        release: 0.01             // 매우 짧은 릴리즈 - 하이햇의 날카로움
      },
      harmonicity: 5.1,           // 하모닉스 비율
      modulationIndex: 32,        // 모듈레이션 강도
      resonance: 4000,            // 레조넌스 주파수
      octaves: 1.5                // 옥타브 범위
    });

    // 탐 설정 - 킥과 다른 설정의 멤브레인 신스
    this.tomSynth = new Tone.MembraneSynth({
      pitchDecay: 0.08,           // 킥보다 느린 피치 하강
      octaves: 6,                 // 킥보다 작은 피치 하강 범위
      oscillator: { 
        type: 'sine' 
      },
      envelope: { 
        attack: 0.001,
        decay: 0.3,               // 킥보다 짧은 디케이
        sustain: 0.05,            // 약간의 서스테인
        release: 0.8              // 킥보다 짧은 릴리즈
      }
    });

    // 드럼 전용 컴프레서 - 펀치있는 사운드
    this.drumCompressor = new Tone.Compressor({
      threshold: -12,             // 컴프레션 시작점
      ratio: 4,                   // 적당한 컴프레션
      attack: 0.001,              // 매우 빠른 어택
      release: 0.05               // 짧은 릴리즈
    });

    // 드럼 전용 3밴드 EQ
    this.drumEQ = new Tone.EQ3({
      low: 3,                     // 저음 부스트 (킥 강화)
      mid: 0,                     // 중음 플랫
      high: 2                     // 고음 약간 부스트 (하이햇 강화)
    });

    // 드럼 리버브/딜레이/스테레오 와이드 (send 스타일)
    this.drumReverb = new Tone.Reverb({
      decay: 1.2,
      preDelay: 0.01,
      wet: 0,
    });

    this.drumDelay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.25,
      wet: 0,
    });

    this.drumWide = new Tone.StereoWidener({
      width: 0.3,
    });

  // 신호 체인 연결: 각 드럼 → 컴프레서 → EQ → (스테레오 와이드 → masterInput)
  // additionally connect EQ to reverb/delay as parallel sends
  this.kickSynth.connect(this.drumCompressor);
  this.snareSynth.connect(this.drumCompressor);
  this.hihatSynth.connect(this.drumCompressor);
  this.tomSynth.connect(this.drumCompressor);

  this.drumCompressor.connect(this.drumEQ);
  // 메인 체인
  this.drumEQ.connect(this.drumWide);
  // masterInput이 보장되도록 ensureMasterChain 호출
  AudioEngine.instance.ensureMasterChain();
  if (AudioEngine.instance.masterInput) {
    this.drumWide.connect(AudioEngine.instance.masterInput);
  } else {
    // 만약 예상치 못하게 마스터 인풋이 없다면 Tone.Destination으로 폴백
    console.warn('DrumInstrument: masterInput가 존재하지 않아 Destination으로 연결합니다.');
    this.drumWide.toDestination();
  }
  // sends (병렬) - EQ 출력에서 리버브/딜레이로 보내어 wet로 제어
  this.drumEQ.connect(this.drumReverb);
  this.drumEQ.connect(this.drumDelay);
  this.drumReverb.toDestination();
  this.drumDelay.toDestination();

    console.log('🥁 DrumInstrument 초기화 완료:', this.id);
  }

  public triggerAttackRelease(
    notes: string | string[], 
    duration: string | number, 
    time?: Tone.Unit.Time, 
    velocity?: number
  ): void {
    if (this.disposed) return;

    const currentTime = time || Tone.now();
    const vel = velocity || 0.8;
    
    // 드럼은 노트 이름 또는 채널명으로 트리거
    const triggerItems = Array.isArray(notes) ? notes : [notes];
    
    triggerItems.forEach(item => {
      this.triggerDrumSound(item, duration, currentTime, vel);
    });
  }

  // 드럼 사운드 개별 트리거 - 노트/채널명에 따라 적절한 드럼 선택
  private triggerDrumSound(
    item: string, 
    duration: string | number, 
    time: Tone.Unit.Time, 
    velocity: number
  ): void {
    // 채널명 또는 MIDI 노트로 드럼 사운드 매핑
    switch (item.toLowerCase()) {
      case 'kick':        // 킥 드럼 트리거
      case 'c2':
      case 'c1':
        this.triggerKick(duration, time, velocity);
        break;
        
      case 'snare':       // 스네어 드럼 트리거
      case 'd2':
      case 'e2':
        this.triggerSnare(duration, time, velocity);
        break;
        
      case 'hihat':       // 하이햇 트리거
      case 'hat':
      case 'f#2':
      case 'g2':
        this.triggerHihat(duration, time, velocity);
        break;
        
      case 'tom':         // 탐 트리거
      case 'a2':
      case 'b2':
        this.triggerTom(duration, time, velocity);
        break;
        
      default: {
        // MIDI 노트 번호로 매핑
        const pitch = typeof item === 'string' ? Tone.Frequency(item).toMidi() : 60;
        this.triggerByMidi(pitch, duration, time, velocity);
        break;
      }
    }
  }

  // 개별 드럼 사운드 트리거 메서드들
  private triggerKick(duration: string | number, time: Tone.Unit.Time, velocity: number): void {
    if (!this.kickSynth) {
      console.warn('DrumInstrument: kickSynth가 초기화되지 않았습니다.');
      return;
    }
    const adjustedVelocity = Math.min(velocity * 1.2, 1.0); // 킥은 더 강하게
    this.kickSynth.triggerAttackRelease('C1', duration, time, adjustedVelocity);
  }

  private triggerSnare(duration: string | number, time: Tone.Unit.Time, velocity: number): void {
    if (!this.snareSynth) {
      console.warn('DrumInstrument: snareSynth가 초기화되지 않았습니다.');
      return;
    }
    const adjustedVelocity = Math.min(velocity * 1.1, 1.0); // 스네어도 약간 강하게
    this.snareSynth.triggerAttackRelease(duration, time, adjustedVelocity);
  }

  private triggerHihat(duration: string | number, time: Tone.Unit.Time, velocity: number): void {
    if (!this.hihatSynth) {
      console.warn('DrumInstrument: hihatSynth가 초기화되지 않았습니다.');
      return;
    }
    const adjustedVelocity = velocity * 0.8; // 하이햇은 부드럽게
    this.hihatSynth.triggerAttackRelease(duration, time, adjustedVelocity);
  }

  private triggerTom(duration: string | number, time: Tone.Unit.Time, velocity: number): void {
    if (!this.tomSynth) {
      console.warn('DrumInstrument: tomSynth가 초기화되지 않았습니다.');
      return;
    }
    this.tomSynth.triggerAttackRelease('G2', duration, time, velocity);
  }

  // MIDI 노트를 드럼 사운드에 매핑
  private triggerByMidi(
    midiNote: number, 
    duration: string | number, 
    time: Tone.Unit.Time, 
    velocity: number
  ): void {
    // 일반적인 드럼 머신 MIDI 매핑
    if (midiNote >= 35 && midiNote <= 37) {        // 킥 드럼 범위
      this.triggerKick(duration, time, velocity);
    } else if (midiNote >= 38 && midiNote <= 40) { // 스네어 드럼 범위
      this.triggerSnare(duration, time, velocity);
    } else if (midiNote >= 41 && midiNote <= 46) { // 하이햇 범위
      this.triggerHihat(duration, time, velocity);
    } else if (midiNote >= 47 && midiNote <= 50) { // 탐 범위
      this.triggerTom(duration, time, velocity);
    } else {
      // 기본값으로 킥 사용
      this.triggerKick(duration, time, velocity);
    }
  }

  // 편의 메서드들 - 직접 드럼 사운드 트리거
  public kick(velocity = 0.8): void {
    this.triggerKick('8n', Tone.now(), velocity);
  }

  public snare(velocity = 0.7): void {
    this.triggerSnare('16n', Tone.now(), velocity);
  }

  public hihat(velocity = 0.4): void {
    this.triggerHihat('32n', Tone.now(), velocity);
  }

  public tom(velocity = 0.6): void {
    this.triggerTom('8n', Tone.now(), velocity);
  }

  // SONA 매핑된 파라미터 적용
  protected handleParameterUpdate(
  params: MappedAudioParameters
  ): void {
    if (this.disposed) return;

    // 킥 드럼 파라미터 조절
    if (this.kickSynth) {
      // 피치 디케이 조절 (brightness 영향)
      const pitchDecay = 0.02 + (1 - params.cutoffHz / 8000) * 0.08;
      this.kickSynth.pitchDecay = Math.max(0.01, Math.min(0.1, pitchDecay));
      
      // 옥타브 범위 조절
      const octaves = 8 + (params.cutoffHz / 2000);
      this.kickSynth.octaves = Math.max(4, Math.min(12, octaves));
    }

    // 스네어 파라미터 조절
    if (this.snareSynth) {
      // 엔벨로프 디케이 조절
      const decay = 0.1 + (params.cutoffHz / 16000) * 0.1;
      this.snareSynth.envelope.decay = Math.max(0.05, Math.min(0.2, decay));
    }

    // 하이햇 파라미터 조절
    if (this.hihatSynth) {
      // 하모니시티 조절 (음색 변화)
      const harmonicity = 4 + (params.cutoffHz / 4000);
      this.hihatSynth.harmonicity = Math.max(2, Math.min(8, harmonicity));
      
      // 모듈레이션 인덱스 조절
      const modIndex = 20 + (params.cutoffHz / 200);
      this.hihatSynth.modulationIndex = Math.max(10, Math.min(50, modIndex));
    }

    // EQ 조절
    if (this.drumEQ) {
      // 저음 조절 (킥 강화/약화)
      const lowGain = 2 + (params.outGainDb * 0.2);
      this.drumEQ.low.rampTo(Math.max(0, Math.min(6, lowGain)), 0.08);
      
      // 고음 조절 (하이햇 강화/약화)
      const highGain = 1 + (params.cutoffHz / 8000);
      this.drumEQ.high.rampTo(Math.max(0, Math.min(4, highGain)), 0.08);
    }

    // 컴프레서 조절
    if (this.drumCompressor) {
      const threshold = -15 + (params.outGainDb * 0.3);
      this.drumCompressor.threshold.rampTo(Math.max(-25, Math.min(-5, threshold)), 0.08);
    }

    // 드럼 리버브/딜레이/와이드 업데이트 (send 기반)
    if (this.drumReverb) {
      // reverbSend는 0..1 범위라고 가정, wet 값으로 직접 맵핑
      const wet = clamp01(params.reverbSend);
      this.drumReverb.wet.rampTo(Math.max(0, Math.min(1, wet)), 0.12);
      // reverb 사이즈는 재사용된 값
      this.drumReverb.decay = Math.max(0.2, Math.min(3.0, params.reverbSize ?? 1.2));
    }

    if (this.drumDelay) {
      const dt = Math.max(0.01, Math.min(1.2, params.delayTime ?? 0.25));
      const fb = Math.max(0, Math.min(0.95, params.delayFeedback ?? 0.25));
      this.drumDelay.delayTime.rampTo(dt, 0.08);
      this.drumDelay.feedback.rampTo(fb, 0.08);
      this.drumDelay.wet.rampTo(Math.max(0, Math.min(0.9, params.delayFeedback ?? 0.0)), 0.12);
    }

    if (this.drumWide) {
      const w = Math.max(0, Math.min(1.2, params.stereoWidth ?? 0.3));
      // StereoWidener.width는 직접 할당이 제한적일 수 있으므로 set을 사용
      this.drumWide.set({ width: w });
    }
  }

  protected applyOscillatorType(type: Tone.ToneOscillatorType): void {
    if (this.disposed) return;
  this.kickSynth?.set({ oscillator: { type } } as Partial<Tone.SynthOptions>);
  this.tomSynth?.set({ oscillator: { type } } as Partial<Tone.SynthOptions>);
  }

  public dispose(): void {
    if (this.disposed) return;
    
    // 모든 드럼 신스들 정리
    this.kickSynth?.dispose();
    this.snareSynth?.dispose();
    this.hihatSynth?.dispose();
    this.tomSynth?.dispose();
    this.drumCompressor?.dispose();
    this.drumEQ?.dispose();
    
    super.dispose();
    console.log(`🗑️ DrumInstrument ${this.id} disposed`);
  }
}
