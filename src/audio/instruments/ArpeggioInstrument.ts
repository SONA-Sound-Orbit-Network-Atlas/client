import { AudioEngine } from '../core/AudioEngine';
// ArpeggioInstrument - 아르페지오 전용 악기 (독립 구현)
// MonoSynth + 빠른 패턴 생성 기능으로 아르페지오와 시퀀스를 생성합니다.
// SONA 지침: ARPEGGIO 역할 - pulses 6..16, rotation 2의 배수 스냅, trem_hz ≤ 6

import * as Tone from 'tone';
import type { MappedAudioParameters } from '../../types/audio';
import { AbstractInstrumentBase } from './InstrumentInterface';

export class ArpeggioInstrument extends AbstractInstrumentBase {
  // Tone.js는 같은 oscillator에 대해 start 시간이 반드시 이전 start보다 커야 함
  // 루프 타이밍/재시작 경계에서 동일 시각이 들어오는 것을 방지하기 위한 가드
  private lastTriggerTimeSec = 0;
  
  // 아르페지오 전용 신스와 이펙트 체인
  private arpSynth!: Tone.MonoSynth;         // 메인 아르페지오 신스 (MonoSynth - 빠른 단음 연주)
  private arpFilter!: Tone.Filter;           // 밝고 선명한 아르페지오 톤
  private pingPongDelay!: Tone.PingPongDelay; // 아르페지오 특유의 공간감
  private tremolo!: Tone.Tremolo;            // 리듬감 있는 트레몰로
  private compressor!: Tone.Compressor;      // 일정한 레벨 유지
  private eq!: Tone.EQ3;                     // 3밴드 EQ로 톤 조절

  constructor(id: string = 'arpeggio') {
    super('ARPEGGIO', id);
    this.initializeInstrument();
  }

  private initializeInstrument(): void {
    // 아르페지오 전용 MonoSynth 설정 - 빠른 어택과 짧은 릴리즈
    this.arpSynth = new Tone.MonoSynth({
      oscillator: {
        type: 'square'            // 사각파 - 밝고 선명한 아르페지오 톤
      },
      envelope: {
        attack: 0.005,            // 매우 빠른 어택 - 명확한 시작
        decay: 0.1,               // 빠른 디케이
        sustain: 0.3,             // 낮은 서스테인 - 깔끔한 분리
        release: 0.2              // 짧은 릴리즈 - 빠른 패턴에 적합
      },
      filterEnvelope: {
        attack: 0.005,
        decay: 0.2,
        sustain: 0.4,
        release: 0.3,
        baseFrequency: 2000,      // 고음역에서 시작
        octaves: 1.5
      },
      portamento: 0.01            // 최소한의 글라이드
    });

    // 아르페지오 전용 필터 - 밝고 선명한 톤
    this.arpFilter = new Tone.Filter({
      frequency: 4000,            // 밝은 고음역
      type: 'lowpass',
      rolloff: -12,
      Q: 2                        // 높은 레조넌스로 선명함 강조
    });

    // 핑퐁 딜레이 - 아르페지오의 공간감과 리듬감
    this.pingPongDelay = new Tone.PingPongDelay({
      delayTime: '16n',           // 16분음표 딜레이 - 빠른 패턴에 맞춤
      feedback: 0.3,              // 적당한 피드백
      wet: 0.25                   // 적당한 딜레이 믹스
    });

    // 트레몰로 - 리듬감 있는 볼륨 모듈레이션 (SONA 지침: trem_hz ≤ 6)
    this.tremolo = new Tone.Tremolo({
      frequency: 4,               // 적당한 트레몰로 속도
      depth: 0.2,                 // 가벼운 볼륨 변화
      type: 'sine'                // 부드러운 모듈레이션
    });

    // 아르페지오 전용 컴프레서 - 빠른 패턴의 일정한 레벨
    this.compressor = new Tone.Compressor({
      threshold: -15,             // 적당한 임계값
      ratio: 4,                   // 강한 컴프레션으로 일정한 레벨
      attack: 0.001,              // 매우 빠른 어택
      release: 0.05               // 빠른 릴리즈
    });

    // 3밴드 EQ - 아르페지오 톤 조절
    this.eq = new Tone.EQ3({
      low: -2,                    // 저음 약간 감소 (베이스와 분리)
      mid: 1,                     // 중음 약간 부스트
      high: 3                     // 고음 부스트 (선명함 강조)
    });

    // 신호 체인 연결: arpSynth → compressor → eq → arpFilter → tremolo → pingPongDelay → destination
    this.arpSynth.chain(
  this.compressor,
  this.eq,
  this.arpFilter,
  this.tremolo,
  this.pingPongDelay,
  AudioEngine.instance.masterInput!
    );

    // 트레몰로 시작
    this.tremolo.start();

  // ArpeggioInstrument initialized: this.id
  }

  public triggerAttackRelease(
    notes: string | string[], 
    duration: string | number, 
    time?: Tone.Unit.Time, 
    velocity?: number
  ): void {
    if (this.disposed || !this.arpSynth) {
      console.warn('ArpeggioInstrument: 신스가 초기화되지 않았거나 폐기되었습니다.');
      return;
    }

    // 안전한 시간 보정: 동일/과거 시간 예약을 피하기 위해 아주 작은 epsilon 추가
    const baseTime = (typeof time === 'number') ? time : Tone.now();
    const epsilon = 1e-4; // 0.1ms
    const safeTime = baseTime <= this.lastTriggerTimeSec
      ? this.lastTriggerTimeSec + epsilon
      : baseTime;
    this.lastTriggerTimeSec = safeTime;
    const vel = velocity || 0.6; // 아르페지오는 적당한 벨로시티
    
    // 아르페지오는 단음 연주 (마지막 노트만 사용)
    const note = Array.isArray(notes) ? notes[notes.length - 1] : notes;
    
    try {
      this.arpSynth.triggerAttackRelease(note, duration, safeTime, vel);
    } catch (error) {
      console.error('ArpeggioInstrument triggerAttackRelease 오류:', error);
    }
  }

  // 아르페지오 전용 메서드들

  // 기본 아르페지오 패턴 - 화음을 순차적으로 연주
  public playArpeggio(
    chordNotes: string[], 
    pattern: 'up' | 'down' | 'updown' | 'random' = 'up',
    noteLength: string = '16n',
    velocity: number = 0.6
  ): void {
    if (this.disposed || !this.arpSynth) return;
    
    let sequence: string[] = [];
    
    // 패턴에 따른 노트 순서 결정
    switch (pattern) {
      case 'up':
        sequence = [...chordNotes];
        break;
      case 'down':
        sequence = [...chordNotes].reverse();
        break;
      case 'updown':
        sequence = [...chordNotes, ...[...chordNotes].reverse().slice(1, -1)];
        break;
      case 'random':
        sequence = chordNotes.sort(() => Math.random() - 0.5);
        break;
    }
    
    // 순차적으로 노트 연주
    sequence.forEach((note, index) => {
      const time = Tone.now() + index * Tone.Time(noteLength).toSeconds();
      this.arpSynth.triggerAttackRelease(note, noteLength, time, velocity);
    });
  }

  // 스케일 아르페지오 - 스케일을 기반으로 아르페지오 생성
  public playScaleArp(
    rootNote: string, 
    scale: number[] = [0, 2, 4, 5, 7, 9, 11], // 메이저 스케일
    octaves: number = 2,
    noteLength: string = '16n',
    velocity: number = 0.6
  ): void {
    if (this.disposed) return;
    
    const rootFreq = Tone.Frequency(rootNote);
    const scaleNotes: string[] = [];
    
    // 옥타브 수만큼 스케일 노트 생성
    for (let octave = 0; octave < octaves; octave++) {
      scale.forEach(interval => {
        const note = rootFreq.transpose(interval + (octave * 12)).toNote();
        scaleNotes.push(note);
      });
    }
    
    // 아르페지오 연주
    this.playArpeggio(scaleNotes, 'up', noteLength, velocity);
  }

  // 리듬 아르페지오 - 복잡한 리듬 패턴으로 아르페지오
  public playRhythmArp(
    chordNotes: string[],
    rhythmPattern: boolean[] = [true, false, true, true], // 리듬 패턴 (true = 연주, false = 쉼)
    subdivisions: string = '16n',
    velocity: number = 0.6
  ): void {
    if (this.disposed || !this.arpSynth) return;
    
    let noteIndex = 0;
    
    rhythmPattern.forEach((shouldPlay, stepIndex) => {
      if (shouldPlay) {
        const note = chordNotes[noteIndex % chordNotes.length];
        const time = Tone.now() + stepIndex * Tone.Time(subdivisions).toSeconds();
        this.arpSynth.triggerAttackRelease(note, subdivisions, time, velocity);
        noteIndex++;
      }
    });
  }

  // 연속 아르페지오 - 여러 화음을 연속으로 아르페지오
  public playChordProgression(
    chordProgression: string[][],
    chordDuration: string = '1n',
    arpPattern: 'up' | 'down' | 'updown' = 'up'
  ): void {
    if (this.disposed) return;
    
    chordProgression.forEach((chord, chordIndex) => {
      const chordStartTime = chordIndex * Tone.Time(chordDuration).toSeconds();
      
      // 각 화음의 아르페지오 연주 시간 계산
      setTimeout(() => {
        this.playArpeggio(chord, arpPattern, '16n', 0.5);
      }, chordStartTime * 1000);
    });
  }

  // SONA 매핑된 파라미터 적용 (안전한 null 처리)
  protected handleParameterUpdate(params: MappedAudioParameters): void {
    if (this.disposed) return;

    // 필터 컷오프 조절 - 아르페지오는 밝은 톤 유지
    if (this.arpFilter && typeof params.cutoffHz === 'number' && !isNaN(params.cutoffHz)) {
      const cutoff = Math.max(2000, Math.min(8000, params.cutoffHz));
      this.arpFilter.frequency.rampTo(cutoff, 0.04); // 40ms 스무딩
    }
    
    // 필터 레조넌스 조절
    if (this.arpFilter && typeof params.resonanceQ === 'number' && !isNaN(params.resonanceQ)) {
      const resonance = 1.5 + (params.resonanceQ * 2); // 1.5-3.5 범위
      this.arpFilter.Q.rampTo(resonance, 0.04);
    }
    
    // 트레몰로 조절 (SONA 지침: trem_hz ≤ 6)
    if (this.tremolo) {
      if (typeof params.tremHz === 'number' && !isNaN(params.tremHz)) {
        const tremoloRate = Math.min(6, 2 + (params.tremHz * 0.8)); // 최대 6Hz
        this.tremolo.frequency.rampTo(tremoloRate, 0.02); // 20ms 스무딩
      }
      
      if (typeof params.tremDepth === 'number' && !isNaN(params.tremDepth)) {
        const tremoloDepth = 0.1 + (params.tremDepth * 0.3); // 0.1-0.4 범위
        this.tremolo.depth.rampTo(tremoloDepth, 0.02);
      }
    }
    
    // 핑퐁 딜레이 조절 (새 파라미터 시스템)
    if (this.pingPongDelay) {
      if (typeof params.delayTime === 'number' && !isNaN(params.delayTime)) {
        const delayTimeSeconds = Math.max(0.05, Math.min(0.5, params.delayTime));
        this.pingPongDelay.delayTime.rampTo(delayTimeSeconds, 0.08);
      }
      
      // 딜레이 피드백 조절 (새 파라미터)
      if (typeof params.delayFeedback === 'number' && !isNaN(params.delayFeedback)) {
        const feedback = Math.max(0.1, Math.min(0.6, params.delayFeedback));
        this.pingPongDelay.feedback.rampTo(feedback, 0.08);
      }
    }
    
    // EQ 조절
    if (this.eq) {
      // 고음 조절 (brightness 매핑)
      if (typeof params.outGainDb === 'number' && !isNaN(params.outGainDb)) {
        const highGain = 2 + (params.outGainDb * 0.3);
        this.eq.high.rampTo(Math.max(0, Math.min(6, highGain)), 0.08);
      }
      
      // 중음 조절
      if (typeof params.cutoffHz === 'number' && !isNaN(params.cutoffHz)) {
        const midGain = 0 + (params.cutoffHz / 4000);
        this.eq.mid.rampTo(Math.max(-3, Math.min(3, midGain)), 0.08);
      }
    }
    
    // 어택 시간 조절 (빠른 패턴을 위해 매우 짧게 유지)
    if (this.arpSynth && typeof params.tremDepth === 'number' && !isNaN(params.tremDepth)) {
      const attack = 0.003 + ((1 - params.tremDepth) * 0.007); // 0.003-0.01초
      this.arpSynth.envelope.attack = attack;
    }
    
    // 릴리즈 시간 조절
    if (this.arpSynth && typeof params.reverbSend === 'number' && !isNaN(params.reverbSend)) {
      const release = 0.1 + (params.reverbSend * 0.2); // 0.1-0.3초
      this.arpSynth.envelope.release = release;
    }

    // SONA 지침: ARPEGGIO pulses 6..16, rotation 2의 배수 스냅 적용 (패턴 생성 시)
  }

  protected applyOscillatorType(type: Tone.ToneOscillatorType): void {
    if (this.disposed) return;
  this.arpSynth?.set({ oscillator: { type } } as Partial<Tone.SynthOptions>);
  }

  public dispose(): void {
    if (this.disposed) return;
    
    // 모든 오디오 컴포넌트 정리
    this.arpSynth?.dispose();
    this.arpFilter?.dispose();
    this.pingPongDelay?.dispose();
    this.tremolo?.dispose();
    this.compressor?.dispose();
    this.eq?.dispose();
    
    super.dispose();
  // ArpeggioInstrument disposed: this.id
  }
}
