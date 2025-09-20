// PadInstrument - 패드/앰비언트 전용 악기 (독립 구현)
// PolySynth + Reverb + Chorus로 부드럽고 대기적인 사운드를 생성합니다.
// SONA 지침: PAD 역할 - pulses 2..6, gate 0.70..0.95, reverb_size 0.4..0.9

import * as Tone from 'tone';
import type { MappedAudioParameters } from '../../types/audio';
import { AbstractInstrumentBase } from './InstrumentInterface';
import { AudioEngine } from '../core/AudioEngine';

export class PadInstrument extends AbstractInstrumentBase {
  
  // 패드 전용 신스와 이펙트 체인
  private padSynth!: Tone.PolySynth;         // 메인 패드 신스 (PolySynth - 화음 연주 가능)
  private padFilter!: Tone.Filter;           // 부드러운 패드 톤을 위한 필터
  private padReverb!: Tone.Reverb;           // 공간감을 위한 리버브
  private padChorus!: Tone.Chorus;           // 풍부함을 위한 코러스
  private padDelay!: Tone.FeedbackDelay;     // 추가 공간감을 위한 딜레이
  private compressor!: Tone.Compressor;      // 부드러운 다이나믹스를 위한 컴프레서
  private panner!: Tone.Panner;              // 팬
  private stereo!: Tone.StereoWidener;       // 스테레오 폭
  private sendRev!: Tone.Gain;               // 리버브 센드
  private sendDly!: Tone.Gain;               // 딜레이 센드

  constructor(id: string = 'pad') {
    super('PAD', id);
    this.initializeInstrument();
  }

  private async initializeInstrument(): Promise<void> {
    // 패드 전용 PolySynth 설정 - 여러 음을 동시에 연주 가능
    this.padSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sawtooth'          // 톱니파 - 풍부한 하모닉스
      },
      envelope: {
        attack: 0.5,              // 느린 어택 - 부드러운 시작
        decay: 0.3,               // 적당한 디케이
        sustain: 0.8,             // 긴 서스테인 - 패드의 지속성
        release: 2.0              // 긴 릴리즈 - 자연스러운 페이드아웃
      },
      // PolySynth에는 filterEnvelope 직접 설정 불가 - 개별 Voice에서 처리
      volume: -4                  // 패드 기본 볼륨을 올려 더 잘 들리게 함
    });

    // 패드 전용 로우패스 필터 - 부드러운 톤
    this.padFilter = new Tone.Filter({
      frequency: 2000,            // 중고음역 컷오프
      type: 'lowpass',            // 로우패스 - 거친 고음 제거
      rolloff: -12,               // 부드러운 롤오프
      Q: 0.8                      // 낮은 레조넌스 - 자연스러운 소리
    });

    // 패드 전용 리버브 - 공간감과 깊이
    this.padReverb = new Tone.Reverb({
      decay: 3,                   // 리버브 지속 시간
      preDelay: 0.1,              // 프리 딜레이로 공간감 생성
      wet: 0.35                   // 기본 wet을 올려 공간감을 더 명확히 함
    });

    // 패드 전용 코러스 - 풍부하고 따뜻한 사운드
    this.padChorus = new Tone.Chorus({
      frequency: 1.5,             // 느린 모듈레이션
      delayTime: 5,               // 깊은 코러스
      depth: 0.7,                 // 깊이를 증가시켜 더 풍성한 질감
      spread: 180                 // 넓은 스테레오 이미지
    });

    // 패드 전용 딜레이 - 추가 공간감
    this.padDelay = new Tone.FeedbackDelay({
      delayTime: '8n',            // 8분음표 딜레이
      feedback: 0.3,              // 적당한 피드백
      wet: 0.28                   // 딜레이 wet을 약간 높여 잔향 강조
    });

    // 패드 전용 컴프레서 - 부드러운 다이나믹스
    this.compressor = new Tone.Compressor({
      threshold: -18,             // 낮은 임계값
      ratio: 2,                   // 부드러운 컴프레션
      attack: 0.1,                // 느린 어택 - 자연스러움
      release: 0.5                // 적당한 릴리즈
    });

    // 추가 유틸 노드 및 버스 연결
    this.panner = new Tone.Panner(0);
    this.stereo = new Tone.StereoWidener(0.6);
    this.sendRev = new Tone.Gain(0);
    this.sendDly = new Tone.Gain(0);

    const fx = AudioEngine.instance.getEffectNodes();
    this.sendRev.connect(fx.reverb!);
    this.sendDly.connect(fx.delay!);

    // 리버브 초기화 대기 (비동기 처리)
    await this.padReverb.generate();

    // 신호 체인 연결: padSynth → compressor → padFilter → padChorus → padDelay → padReverb → panner → stereo → destination
    this.padSynth.chain(
  this.compressor,
  this.padFilter,
  this.padChorus,
  this.padDelay,
  this.padReverb,
  this.panner,
  this.stereo,
  AudioEngine.instance.masterInput!
    );

    // 센드 분기
    this.padReverb.connect(this.sendRev);
    this.padDelay.connect(this.sendDly);

    // 코러스 시작
    this.padChorus.start();

    
  }

  public triggerAttackRelease(
    notes: string | string[], 
    duration: string | number, 
    time?: Tone.Unit.Time, 
    velocity?: number
  ): void {
    if (this.disposed || !this.padSynth) {
      console.warn('PadInstrument: 신스가 초기화되지 않았거나 폐기되었습니다.');
      return;
    }

    const currentTime = time || Tone.now();
    const vel = velocity || 0.5; // 패드는 기본적으로 부드러운 벨로시티
    
    // 패드는 화음 연주 지원
    const padNotes = Array.isArray(notes) ? notes : [notes];
    
    try {
      // 패드는 여러 음을 동시에 연주 가능
      this.padSynth.triggerAttackRelease(padNotes, duration, currentTime, vel);
    } catch (error) {
      console.error('PadInstrument triggerAttackRelease 오류:', error);
    }
  }

  // 패드 전용 메서드들

  // 스웰 효과 - 서서히 볼륨이 올라가는 패드 특유의 효과
  public swell(
    notes: string | string[], 
    duration: string | number = '4n', 
    swellTime: number = 1.0
  ): void {
    if (this.disposed || !this.padSynth) return;
    
    const currentTime = Tone.now();
    const padNotes = Array.isArray(notes) ? notes : [notes];
    
    // 볼륨을 0으로 시작
    this.padSynth.volume.setValueAtTime(-Infinity, currentTime);
    
    // 서서히 볼륨 증가
    this.padSynth.volume.exponentialRampToValueAtTime(-8, currentTime + swellTime);
    
    // 노트 트리거
    this.padSynth.triggerAttackRelease(padNotes, duration, currentTime, 0.6);
  }

  // 아르페지오 효과 - 화음을 순차적으로 연주
  public arpeggiate(
    chordNotes: string[], 
    noteInterval: string = '16n', 
    velocity: number = 0.4
  ): void {
    if (this.disposed || !this.padSynth) return;
    
    chordNotes.forEach((note, index) => {
      const time = Tone.now() + index * Tone.Time(noteInterval).toSeconds();
      this.padSynth.triggerAttackRelease(note, '2n', time, velocity);
    });
  }

  // 코드 보이싱 - 기본 화음들을 생성
  public playChord(
    root: string, 
    chordType: 'major' | 'minor' | 'maj7' | 'min7' | 'sus2' | 'sus4' = 'major',
    duration: string | number = '1n',
    velocity: number = 0.5
  ): void {
    if (this.disposed) return;
    
    const rootFreq = Tone.Frequency(root);
    let intervals: number[];
    
    // 화음 타입에 따른 음정 간격 정의
    switch (chordType) {
      case 'major':
        intervals = [0, 4, 7, 12];        // 루트, 3도, 5도, 옥타브
        break;
      case 'minor':
        intervals = [0, 3, 7, 12];        // 루트, 단3도, 5도, 옥타브
        break;
      case 'maj7':
        intervals = [0, 4, 7, 11];        // 메이저 7th
        break;
      case 'min7':
        intervals = [0, 3, 7, 10];        // 마이너 7th
        break;
      case 'sus2':
        intervals = [0, 2, 7, 12];        // 서스펜디드 2nd
        break;
      case 'sus4':
        intervals = [0, 5, 7, 12];        // 서스펜디드 4th
        break;
    }
    
    // 간격을 실제 노트로 변환
    const chordNotes = intervals.map(interval => 
      rootFreq.transpose(interval).toNote()
    );
    
    this.triggerAttackRelease(chordNotes, duration, undefined, velocity);
  }

  // SONA 매핑된 파라미터 적용 (안전한 null 처리)
  protected handleParameterUpdate(
  params: MappedAudioParameters
  ): void {
    if (this.disposed) return;

    // 모든 파라미터에 대해 clamp 적용
    // 컷오프 (200~14000Hz)
    const cutoff = Math.max(200, Math.min(14000, params.cutoffHz ?? 2000));
    // 레조넌스 (0.5~2.5)
    const resonance = Math.max(0.5, Math.min(2.5, params.resonanceQ ?? 1));
    // 리버브 디케이 (0.5~6)
    const reverbSend = Math.max(0, Math.min(1, params.reverbSend ?? 0.3));
    const reverbDecay = Math.max(0.5, Math.min(6, 0.5 + reverbSend * 5.5));
    // 코러스 깊이 (0.1~0.8)
    const chorusDepth = Math.max(0.1, Math.min(0.8, 0.3 + (Math.max(0, Math.min(1, params.chorusDepth ?? 0.5)) * 0.4)));
    // 코러스 주파수 (0.2~3)
    const tremDepth = Math.max(0, Math.min(1, params.tremDepth ?? 0.5));
    const chorusRate = Math.max(0.2, Math.min(3, 0.5 + tremDepth * 2));
    // 딜레이 시간 (0.1~1.0)
    const delayTimeSeconds = Math.max(0.1, Math.min(1.0, params.delayTime ?? 0.3));
    // 딜레이 피드백 (0.1~0.6)
    const feedback = Math.max(0.1, Math.min(0.6, Math.max(0, Math.min(1, params.delayFeedback ?? 0.3))));
    // 어택 (0.3~1.3)
    const attack = Math.max(0.3, Math.min(1.3, 0.3 + ((1 - tremDepth) * 1.0)));
    // 볼륨 (-30~0)
    const outGainDb = Math.max(-30, Math.min(0, params.outGainDb ?? -10));
    // 스테레오 폭 (0~1.5)
    const stereoWidth = Math.max(0, Math.min(1.5, params.stereoWidth ?? 0.7));
    // 팬 (-0.8~0.8)
    const pan = Math.max(-0.8, Math.min(0.8, params.pan ?? 0));

    // 실제 Tone.js에 적용 (모든 0~1 파라미터에 clamp01 적용)
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    if (this.padFilter) {
      this.padFilter.frequency.rampTo(cutoff, 0.04);
      this.padFilter.Q.rampTo(resonance, 0.04);
      
    }
    if (this.padReverb) {
      this.padReverb.decay = reverbDecay;
      
    }
    if (this.padChorus) {
      this.padChorus.depth = clamp01(chorusDepth);
      this.padChorus.frequency.rampTo(chorusRate, 0.08);
    }
    if (this.padDelay) {
      this.padDelay.delayTime.rampTo(delayTimeSeconds, 0.08);
      this.padDelay.feedback.rampTo(clamp01(feedback), 0.08);
    }
    if (this.padSynth) {
      this.padSynth.set({ envelope: { attack } });
      this.padSynth.volume.rampTo(outGainDb, 0.08);
      
    }
    if (this.panner) this.panner.pan.rampTo(pan, 0.08);
    if (this.stereo) {
      this.stereo.width.rampTo(Math.max(0, Math.min(1.5, stereoWidth)), 0.1);
      
    }
    if (this.sendRev) this.sendRev.gain.rampTo(clamp01(Math.max(0, Math.min(0.9, reverbSend))), 0.12);
    if (this.sendDly) this.sendDly.gain.rampTo(clamp01(Math.max(0, Math.min(0.9, feedback * 0.8))), 0.12);
  }

  protected applyOscillatorType(type: Tone.ToneOscillatorType): void {
    if (this.disposed) return;
  this.padSynth?.set({ oscillator: { type } } as Partial<Tone.SynthOptions>);
  }

  public dispose(): void {
    if (this.disposed) return;
    
    // 모든 오디오 컴포넌트 정리
    this.padSynth?.dispose();
    this.padFilter?.dispose();
    this.padReverb?.dispose();
    this.padChorus?.dispose();
    this.padDelay?.dispose();
    this.compressor?.dispose();
    
    super.dispose();
    
  }
}
