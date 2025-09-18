// ChordInstrument - 화음 전용 악기 (독립 구현)
// PolySynth + 화음 보이싱 기능으로 풍부한 화음을 연주합니다.
// SONA 지침: CHORD 역할 - 화음 연주에 특화된 설정

import * as Tone from 'tone';
import type { MappedAudioParameters } from '../../types/audio';
import {
  BaseInstrument,
  type SimplifiedInstrumentMacros,
  type ResolvedInstrumentContext,
} from './InstrumentInterface';

export class ChordInstrument extends BaseInstrument {
  
  // 화음 전용 신스와 이펙트 체인
  private chordSynth!: Tone.PolySynth;       // 메인 화음 신스 (PolySynth - 다성 연주)
  private chordFilter!: Tone.Filter;         // 화음 톤 조절
  private stereoChorus!: Tone.Chorus;        // 스테레오 코러스 - 화음의 풍부함
  private autoFilter!: Tone.AutoFilter;      // 자동 필터 - 리듬감 있는 모듈레이션
  private compressor!: Tone.Compressor;      // 화음 레벨 정리
  private eq!: Tone.EQ3;                     // 3밴드 EQ로 화음 밸런스
  private distortion!: Tone.Distortion;     // 가벼운 디스토션 - 화음 압축과 따뜻함

  constructor(id: string = 'chord') {
    super('CHORD', id);
    this.initializeInstrument();
  }

  private initializeInstrument(): void {
    // 화음 전용 PolySynth 설정 - 기본 설정으로 단순화
    this.chordSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sawtooth'            // 톱니파 - 풍부한 하모닉스
      },
      envelope: {
        attack: 0.02,               // 부드러운 어택
        decay: 0.3,                 // 적당한 디케이
        sustain: 0.7,               // 높은 서스테인 - 화음 유지
        release: 1.0                // 긴 릴리즈 - 자연스러운 감쇠
      }
    });

    // 화음 전용 필터 - 따뜻한 톤
    this.chordFilter = new Tone.Filter({
      frequency: 2500,              // 중간 고음역
      type: 'lowpass',
      rolloff: -24,                 // 부드러운 컷오프
      Q: 1.2                        // 적당한 레조넌스
    });

    // 스테레오 코러스 - 화음의 공간감과 풍부함
    this.stereoChorus = new Tone.Chorus({
      frequency: 0.8,               // 느린 모듈레이션
      delayTime: 8,                 // 8ms 딜레이
      depth: 0.6,                   // 깊은 모듈레이션
      feedback: 0.1,                // 가벼운 피드백
      spread: 180                   // 완전한 스테레오 스프레드
    });

    // 자동 필터 - 리듬감 있는 화음 모듈레이션
    this.autoFilter = new Tone.AutoFilter({
      frequency: '8n',              // 8분음표 주기
      type: 'sine',                 // 부드러운 사인파
      depth: 0.3,                   // 적당한 깊이
      baseFrequency: 1500,          // 기본 필터 주파수
      octaves: 1.5,                 // 모듈레이션 범위
      filter: {
        type: 'lowpass',
        rolloff: -12,
        Q: 1
      }
    });

    // 화음 전용 컴프레서 - 레벨 정리
    this.compressor = new Tone.Compressor({
      threshold: -18,               // 낮은 임계값
      ratio: 3,                     // 적당한 컴프레션
      attack: 0.01,                 // 빠른 어택
      release: 0.1                  // 빠른 릴리즈
    });

    // 가벼운 디스토션 - 화음의 따뜻함과 압축
    this.distortion = new Tone.Distortion({
      distortion: 0.15,             // 가벼운 디스토션
      oversample: '2x'              // 오버샘플링으로 품질 향상
    });

    // 3밴드 EQ - 화음 밸런스
    this.eq = new Tone.EQ3({
      low: 0,                       // 저음 중립
      mid: 2,                       // 중음 약간 부스트
      high: 1                       // 고음 약간 부스트
    });

    // 신호 체인 연결: chordSynth → distortion → compressor → eq → chordFilter → autoFilter → stereoChorus → destination
    this.chordSynth.chain(
      this.distortion,
      this.compressor,
      this.eq,
      this.chordFilter,
      this.autoFilter,
      this.stereoChorus,
      Tone.Destination
    );

    // 자동 필터와 코러스 시작
    this.autoFilter.start();
    this.stereoChorus.start();

    console.log('🎹 ChordInstrument 초기화 완료:', this.id);
  }

  public triggerAttackRelease(
    notes: string | string[], 
    duration: string | number, 
    time?: Tone.Unit.Time, 
    velocity?: number
  ): void {
    if (this.disposed || !this.chordSynth) {
      console.warn('ChordInstrument: 신스가 초기화되지 않았거나 폐기되었습니다.');
      return;
    }

    const currentTime = time || Tone.now();
    const vel = velocity || 0.7; // 화음은 적당한 벨로시티
    
    try {
      this.chordSynth.triggerAttackRelease(notes, duration, currentTime, vel);
    } catch (error) {
      console.error('ChordInstrument triggerAttackRelease 오류:', error);
    }
  }

  // 화음 전용 메서드들

  // 기본 화음 연주 - 루트 노트와 화음 타입으로 화음 생성
  public playChord(
    rootNote: string, 
    chordType: 'major' | 'minor' | 'dominant7' | 'major7' | 'minor7' | 'diminished' | 'augmented' = 'major',
    inversion: number = 0,
    duration: string = '2n',
    velocity: number = 0.7
  ): void {
    if (this.disposed) return;
    
    const chord = this.generateChord(rootNote, chordType, inversion);
    this.triggerAttackRelease(chord, duration, undefined, velocity);
  }

  // 화음 프로그레션 연주 - 여러 화음을 순차적으로 연주
  public playProgression(
    progression: Array<{root: string, type: string, duration?: string}>,
    baseVelocity: number = 0.7
  ): void {
    if (this.disposed) return;
    
    let currentTime = Tone.now();
    
    progression.forEach((chordInfo) => {
      const chord = this.generateChord(chordInfo.root, chordInfo.type as 'major' | 'minor' | 'dominant7' | 'major7' | 'minor7' | 'diminished' | 'augmented');
      const duration = chordInfo.duration || '1n';
      
      this.chordSynth.triggerAttackRelease(chord, duration, currentTime, baseVelocity);
      currentTime += Tone.Time(duration).toSeconds();
    });
  }

  // 화음 스트럼 - 아르페지오처럼 화음을 순차적으로 연주
  public strumChord(
    chordNotes: string[],
    direction: 'up' | 'down' = 'up',
    strumSpeed: number = 0.03, // 30ms 간격
    duration: string = '2n',
    velocity: number = 0.6
  ): void {
    if (this.disposed) return;
    
    const notes = direction === 'up' ? chordNotes : [...chordNotes].reverse();
    
    notes.forEach((note, index) => {
      const time = Tone.now() + (index * strumSpeed);
      this.chordSynth.triggerAttackRelease([note], duration, time, velocity);
    });
  }

  // 보이싱 화음 - 더 풍부한 화음 보이싱
  public playVoicedChord(
    rootNote: string,
    chordType: string = 'major',
    voicing: 'close' | 'open' | 'drop2' | 'drop3' = 'close',
    octave: number = 4,
    duration: string = '2n',
    velocity: number = 0.7
  ): void {
    if (this.disposed) return;
    
    const chord = this.generateVoicedChord(rootNote, chordType, voicing, octave);
    this.triggerAttackRelease(chord, duration, undefined, velocity);
  }

  // 리듬 화음 - 리듬 패턴으로 화음 연주
  public playRhythmChord(
    chordNotes: string[],
    rhythmPattern: boolean[] = [true, false, true, false], // 리듬 패턴
    subdivisions: string = '8n',
    velocity: number = 0.6
  ): void {
    if (this.disposed) return;
    
    rhythmPattern.forEach((shouldPlay, stepIndex) => {
      if (shouldPlay) {
        const time = Tone.now() + stepIndex * Tone.Time(subdivisions).toSeconds();
        this.chordSynth.triggerAttackRelease(chordNotes, subdivisions, time, velocity);
      }
    });
  }

  // 화음 생성 유틸리티
  private generateChord(rootNote: string, chordType: string, inversion: number = 0): string[] {
    const root = Tone.Frequency(rootNote);
    let intervals: number[] = [];
    
    // 화음 타입별 인터벌 정의
    switch (chordType) {
      case 'major':
        intervals = [0, 4, 7];
        break;
      case 'minor':
        intervals = [0, 3, 7];
        break;
      case 'dominant7':
        intervals = [0, 4, 7, 10];
        break;
      case 'major7':
        intervals = [0, 4, 7, 11];
        break;
      case 'minor7':
        intervals = [0, 3, 7, 10];
        break;
      case 'diminished':
        intervals = [0, 3, 6];
        break;
      case 'augmented':
        intervals = [0, 4, 8];
        break;
      default:
        intervals = [0, 4, 7]; // 기본값: 메이저
    }
    
    // 인버전 적용
    for (let i = 0; i < inversion; i++) {
      const lowest = intervals.shift();
      if (lowest !== undefined) {
        intervals.push(lowest + 12); // 옥타브 위로
      }
    }
    
    // 노트 배열 생성
    return intervals.map(interval => root.transpose(interval).toNote());
  }

  // 보이싱된 화음 생성
  private generateVoicedChord(
    rootNote: string, 
    chordType: string, 
    voicing: string, 
    octave: number
  ): string[] {
    const baseChord = this.generateChord(rootNote, chordType);
    const rootFreq = Tone.Frequency(rootNote + octave);
    
    switch (voicing) {
      case 'close':
        // 가까운 보이싱 - 기본 화음
        return baseChord.map((_, index) => 
          rootFreq.transpose(this.getChordInterval(chordType, index)).toNote()
        );
        
      case 'open': {
        // 열린 보이싱 - 음들 사이에 간격
        return baseChord.map((_, index) => 
          rootFreq.transpose(this.getChordInterval(chordType, index) + (index * 5)).toNote()
        );
      }
        
      case 'drop2': {
        // Drop2 보이싱 - 두 번째 음을 옥타브 아래로
        const drop2 = this.generateChord(rootNote, chordType);
        if (drop2.length > 1) {
          const secondNote = Tone.Frequency(drop2[1]).transpose(-12).toNote();
          return [drop2[0], secondNote, ...drop2.slice(2)];
        }
        return drop2;
      }
        
      case 'drop3': {
        // Drop3 보이싱 - 세 번째 음을 옥타브 아래로
        const drop3 = this.generateChord(rootNote, chordType);
        if (drop3.length > 2) {
          const thirdNote = Tone.Frequency(drop3[2]).transpose(-12).toNote();
          return [drop3[0], drop3[1], thirdNote, ...drop3.slice(3)];
        }
        return drop3;
      }
        
      default:
        return baseChord;
    }
  }

  // 화음 인터벌 가져오기
  private getChordInterval(chordType: string, noteIndex: number): number {
    const intervalMap: { [key: string]: number[] } = {
      'major': [0, 4, 7],
      'minor': [0, 3, 7],
      'dominant7': [0, 4, 7, 10],
      'major7': [0, 4, 7, 11],
      'minor7': [0, 3, 7, 10],
      'diminished': [0, 3, 6],
      'augmented': [0, 4, 8]
    };
    
    const intervals = intervalMap[chordType] || intervalMap['major'];
    return intervals[noteIndex] || 0;
  }

  // SONA 매핑된 파라미터 적용
  protected handleParameterUpdate(
    params: MappedAudioParameters,
    _macros: SimplifiedInstrumentMacros,
    _context: ResolvedInstrumentContext
  ): void {
    if (this.disposed) return;

    // 필터 컷오프 조절 - 화음의 밝기
    if (this.chordFilter) {
      const cutoff = Math.max(1000, Math.min(6000, params.cutoffHz));
      this.chordFilter.frequency.rampTo(cutoff, 0.04); // 40ms 스무딩
    }
    
    // 필터 레조넌스 조절
    if (this.chordFilter) {
      const resonance = 0.8 + (params.resonanceQ * 1.5); // 0.8-2.3 범위
      this.chordFilter.Q.rampTo(resonance, 0.04);
    }
    
    // 코러스 깊이 조절
    if (this.stereoChorus) {
      const chorusDepth = 0.3 + (params.chorusDepth * 0.5); // 0.3-0.8 범위
      this.stereoChorus.depth = chorusDepth;
      
      const chorusFreq = 0.5 + (params.tremHz * 0.3); // 0.5-2.9 Hz
      this.stereoChorus.frequency.rampTo(chorusFreq, 0.06);
    }
    
    // 자동 필터 조절
    if (this.autoFilter) {
      const filterDepth = 0.2 + (params.tremDepth * 0.4); // 0.2-0.6 범위
      this.autoFilter.depth.rampTo(filterDepth, 0.02);
      
      const filterFreq = Math.max(0.5, params.tremHz * 2); // 최소 0.5Hz
      this.autoFilter.frequency.rampTo(filterFreq + 'hz', 0.02);
    }
    
    // 디스토션 조절
    if (this.distortion) {
      const distAmount = 0.05 + (params.chorusDepth * 0.25); // 0.05-0.3 범위
      this.distortion.distortion = Math.max(0, Math.min(0.4, distAmount));
    }
    
    // EQ 조절
    if (this.eq) {
      // 고음 조절 (brightness 매핑)
      const highGain = 0 + (params.outGainDb * 0.4);
      this.eq.high.rampTo(Math.max(-3, Math.min(6, highGain)), 0.08);
      
      // 중음 조절
      const midGain = 1 + (params.cutoffHz / 3000);
      this.eq.mid.rampTo(Math.max(-2, Math.min(4, midGain)), 0.08);
      
      // 저음 조절
      const lowGain = -1 + (params.reverbSend * 2);
      this.eq.low.rampTo(Math.max(-3, Math.min(2, lowGain)), 0.08);
    }
    
    // 어택/릴리즈 시간 조절
    if (this.chordSynth) {
      const attack = 0.01 + (params.tremDepth * 0.05); // 0.01-0.06초
      const release = 0.8 + (params.reverbSend * 0.4); // 0.8-1.2초
      
      // PolySynth의 각 보이스에 적용
      this.chordSynth.set({
        envelope: {
          attack: attack,
          release: release
        }
      });
    }
  }

  protected applyOscillatorType(type: Tone.ToneOscillatorType): void {
    if (this.disposed) return;
    this.chordSynth?.set({ oscillator: { type } } as any);
  }

  public dispose(): void {
    if (this.disposed) return;
    
    // 모든 오디오 컴포넌트 정리
    this.chordSynth?.dispose();
    this.chordFilter?.dispose();
    this.stereoChorus?.dispose();
    this.autoFilter?.dispose();
    this.compressor?.dispose();
    this.eq?.dispose();
    this.distortion?.dispose();
    
    super.dispose();
    console.log(`🗑️ ChordInstrument ${this.id} disposed`);
  }
}
