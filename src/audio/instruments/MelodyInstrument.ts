// MelodyInstrument - 멜로디/리드 전용 악기 (독립 구현)
// MonoSynth + 표현력 이펙트로 섬세하고 표현력 있는 멜로디 라인을 생성합니다.
// SONA 지침: MELODY/LEAD 역할 - range 55..84, reverb_send ≤ 0.25, swing ≤ 25%

import * as Tone from 'tone';
import type { MappedAudioParameters } from '../../types/audio';
import { AudioEngine } from '../core/AudioEngine';
import { AbstractInstrumentBase } from './InstrumentInterface';

export class MelodyInstrument extends AbstractInstrumentBase {
  
  // 멜로디 전용 신스와 이펙트 체인
  private melodySynth!: Tone.MonoSynth;      // 메인 멜로디 신스 (MonoSynth - 단음 연주에 최적화)
  private melodyFilter!: Tone.Filter;        // 표현력을 위한 필터
  private vibrato!: Tone.Vibrato;            // 비브라토 효과
  private chorus!: Tone.Chorus;              // 코러스로 풍부함 추가
  private compressor!: Tone.Compressor;      // 일정한 레벨 유지
  private distortion!: Tone.Distortion;      // 가벼운 드라이브 효과
  private panner!: Tone.Panner;              // 팬
  private stereo!: Tone.StereoWidener;       // 스테레오 폭
  private sendRev!: Tone.Gain;               // 리버브 센드
  private sendDly!: Tone.Gain;               // 딜레이 센드
  
  // 표현력 제어 상태
  private isLegato = false;                  // 레가토 모드 상태

  constructor(id: string = 'melody') {
    super('MELODY', id);
    this.initializeInstrument();
  }

  private initializeInstrument(): void {
    // 멜로디 전용 MonoSynth 설정 - 표현력 있는 단음 연주
    this.melodySynth = new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth'          // 톱니파 - 밝고 풍부한 멜로디 톤
      },
      envelope: {
        attack: 0.02,             // 빠른 어택 - 명확한 시작
        decay: 0.2,               // 짧은 디케이
        sustain: 0.8,             // 높은 서스테인 - 멜로디 지속
        release: 0.5              // 적당한 릴리즈
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.6,
        release: 0.4,
        baseFrequency: 1000,      // 중고음역에서 시작
        octaves: 2
      },
      portamento: 0.1             // 글라이드 효과
    });

    // 멜로디 전용 필터 - 표현력과 음색 조절
    this.melodyFilter = new Tone.Filter({
      frequency: 3000,            // 밝은 멜로디 톤
      type: 'lowpass',
      rolloff: -12,
      Q: 1.5                      // 적당한 레조넌스로 표현력 추가
    });

    // 비브라토 - 멜로디의 표현력을 위한 피치 모듈레이션
    this.vibrato = new Tone.Vibrato({
      frequency: 5,               // 비브라토 속도
      depth: 0.02,                // 가벼운 비브라토
      type: 'sine'                // 부드러운 모듈레이션
    });

    // 멜로디 전용 코러스 - 풍부함과 공간감
    this.chorus = new Tone.Chorus({
      frequency: 2,               // 적당한 모듈레이션 속도
      delayTime: 3,               // 적당한 코러스 깊이
      depth: 0.3,                 // 적당한 모듈레이션 깊이
      spread: 90                  // 스테레오 확산
    });

    // 멜로디 전용 컴프레서 - 일정한 레벨과 펀치감
    this.compressor = new Tone.Compressor({
      threshold: -18,             // 적당한 임계값
      ratio: 3,                   // 적당한 컴프레션
      attack: 0.003,              // 빠른 어택
      release: 0.1                // 짧은 릴리즈
    });

    // 가벼운 디스토션 - 멜로디에 캐릭터 추가
    this.distortion = new Tone.Distortion({
      distortion: 0.1,            // 매우 가벼운 디스토션
      oversample: '4x'
    });

    // 추가 유틸 노드
    this.panner = new Tone.Panner(0);
    this.stereo = new Tone.StereoWidener(0.5);
    this.sendRev = new Tone.Gain(0);
    this.sendDly = new Tone.Gain(0);

    // 전역 이펙트 버스와 연결
    const fx = AudioEngine.instance.getEffectNodes();
    this.sendRev.connect(fx.reverb!);
    this.sendDly.connect(fx.delay!);

    // 신호 체인 연결: melodySynth → compressor → distortion → melodyFilter → vibrato → chorus → (dry + sends)
    AudioEngine.instance.ensureMasterChain();
    const dest = AudioEngine.instance.masterInput ?? Tone.getDestination();
    this.melodySynth.chain(
      this.compressor,
      this.distortion,
      this.melodyFilter,
      this.vibrato,
      this.chorus,
      this.panner,
      this.stereo,
      dest
    );

    // 센드: 코러스 이후의 신호를 리버브/딜레이로 분기
    this.chorus.connect(this.sendRev);
    this.chorus.connect(this.sendDly);

    // 이펙트 시작
    // Vibrato는 자동으로 작동하므로 별도 start 불필요
    this.chorus.start();

  // MelodyInstrument initialized: this.id
  }

  public triggerAttackRelease(
    notes: string | string[], 
    duration: string | number, 
    time?: Tone.Unit.Time, 
    velocity?: number
  ): void {
    if (this.disposed || !this.melodySynth) {
      console.warn('MelodyInstrument: 신스가 초기화되지 않았거나 폐기되었습니다.');
      return;
    }

    const currentTime = time || Tone.now();
    const vel = velocity || 0.7; // 멜로디는 표현력 있는 벨로시티
    
    // 멜로디는 단음 연주 (마지막 노트만 사용)
    const note = Array.isArray(notes) ? notes[notes.length - 1] : notes;
    
    try {
      this.melodySynth.triggerAttackRelease(note, duration, currentTime, vel);
    } catch (error) {
      console.error('MelodyInstrument triggerAttackRelease 오류:', error);
    }
  }

  // 멜로디 전용 표현력 메서드들

  // 레가토 연주 - 부드러운 연결
  public triggerLegato(note: string, velocity: number = 0.7): void {
    if (this.disposed || !this.melodySynth) return;
    
    if (this.isLegato) {
      // 이미 레가토 모드면 새 노트만 트리거
      this.melodySynth.setNote(note, Tone.now());
    } else {
      // 레가토 모드 시작
      this.melodySynth.triggerAttack(note, Tone.now(), velocity);
      this.isLegato = true;
    }
  }

  // 레가토 종료
  public releaseLegato(): void {
    if (this.disposed || !this.melodySynth || !this.isLegato) return;
    
    this.melodySynth.triggerRelease(Tone.now());
    this.isLegato = false;
  }

  // 피치 벤드 - 음정 굽히기
  public setPitchBend(cents: number): void {
    if (this.disposed || !this.melodySynth) return;
    
    this.melodySynth.detune.rampTo(cents, 0.05); // 50ms로 부드럽게 변경
  }

  // 비브라토 조절
  public setVibratoDepth(depth: number): void {
    if (this.disposed || !this.vibrato) return;
    
    const clampedDepth = Math.max(0, Math.min(0.1, depth)); // 0-0.1 범위로 제한
    this.vibrato.depth.rampTo(clampedDepth, 0.1);
  }

  // 비브라토 속도 조절
  public setVibratoRate(rate: number): void {
    if (this.disposed || !this.vibrato) return;
    
    const clampedRate = Math.max(1, Math.min(10, rate)); // 1-10 Hz 범위
    this.vibrato.frequency.rampTo(clampedRate, 0.1);
  }

  // 글라이드/포르타멘토 조절
  public setGlide(time: number): void {
    if (this.disposed || !this.melodySynth) return;
    
    const clampedTime = Math.max(0, Math.min(1, time)); // 0-1초 범위
    this.melodySynth.portamento = clampedTime;
  }

  // 트릴 효과 - 빠른 음정 교대
  public trill(
    note1: string, 
    note2: string, 
    trillRate: string = '32n', 
    duration: string = '1n'
  ): void {
    if (this.disposed || !this.melodySynth) return;
    
    const startTime = Tone.now();
    const durationSeconds = Tone.Time(duration).toSeconds();
    const trillInterval = Tone.Time(trillRate).toSeconds();
    
    let currentNote = note1;
    let noteCount = 0;
    
    const trillLoop = () => {
      if (noteCount * trillInterval >= durationSeconds) return;
      
      const time = startTime + noteCount * trillInterval;
      this.melodySynth.triggerAttackRelease(currentNote, trillRate, time, 0.6);
      
      // 노트 교대
      currentNote = currentNote === note1 ? note2 : note1;
      noteCount++;
      
      // 다음 노트 스케줄
      if (noteCount * trillInterval < durationSeconds) {
        setTimeout(trillLoop, trillInterval * 1000);
      }
    };
    
    trillLoop();
  }

  // SONA 매핑된 파라미터 적용
  protected handleParameterUpdate(
  params: MappedAudioParameters
  ): void {
    if (this.disposed) return;

    // 필터 컷오프 조절 - 멜로디는 밝은 톤 유지
    if (this.melodyFilter) {
      const cutoff = Math.max(1500, Math.min(8000, params.cutoffHz));
      this.melodyFilter.frequency.rampTo(cutoff, 0.04); // 40ms 스무딩
    }
    
    // 필터 레조넌스 조절
    if (this.melodyFilter) {
      const resonance = 1 + (params.resonanceQ * 3); // 1-4 범위
      this.melodyFilter.Q.rampTo(resonance, 0.04);
    }
    
    // 비브라토 깊이 조절 (spin 매핑)
    if (this.vibrato) {
      const vibratoDepth = 0.01 + (params.tremDepth * 0.05); // 0.01-0.06 범위
      this.vibrato.depth.rampTo(vibratoDepth, 0.02); // 20ms 스무딩
      
      // 비브라토 속도 조절
      const vibratoRate = 3 + (params.tremHz * 0.5); // 3-7 Hz 범위
      this.vibrato.frequency.rampTo(vibratoRate, 0.02);
    }
    
    // 코러스 조절
    if (this.chorus) {
      const chorusDepth = 0.2 + (params.chorusDepth * 0.3);
      this.chorus.depth = Math.max(0.1, Math.min(0.6, chorusDepth));
      
      const chorusRate = 1 + (params.tremDepth * 2);
      this.chorus.frequency.rampTo(Math.max(0.5, Math.min(4, chorusRate)), 0.08);
    }

    // 팬/스테레오
    if (this.panner) this.panner.pan.rampTo(params.pan ?? 0, 0.05);
    if (this.stereo) this.stereo.width.rampTo(Math.max(0, Math.min(1, params.stereoWidth ?? 0.5)), 0.08);

    // 리버브/딜레이 센드 레벨
    if (this.sendRev) this.sendRev.gain.rampTo(Math.max(0, Math.min(0.9, params.reverbSend ?? 0)), 0.08);
    if (this.sendDly) this.sendDly.gain.rampTo(Math.max(0, Math.min(0.9, (params.delayFeedback ?? 0) * 0.8)), 0.08);
    
    // 디스토션 조절
    if (this.distortion) {
      const distAmount = 0.05 + (params.waveFold * 0.2); // 매우 가벼운 디스토션
      this.distortion.distortion = Math.max(0, Math.min(0.3, distAmount));
    }
    
    // 포르타멘토 조절 (size 매핑)
    if (this.melodySynth) {
      const glideTime = 0.05 + (params.pitchSemitones / 14 * 0.2); // size 기반 글라이드
      this.melodySynth.portamento = Math.max(0, Math.min(0.3, Math.abs(glideTime)));
    }
    
    // 어택 시간 조절
    if (this.melodySynth) {
      const attack = 0.01 + ((1 - params.tremDepth) * 0.05); // 0.01-0.06초
      this.melodySynth.envelope.attack = attack;
    }
    
    // 필터 엔벨로프 조절
    if (this.melodySynth) {
      const filterEnvAmount = 1 + (params.cutoffHz / 4000);
      this.melodySynth.filterEnvelope.octaves = Math.max(0.5, Math.min(3, filterEnvAmount));
    }

    // SONA 지침: MELODY reverb_send ≤ 0.25 적용 (전역 이펙트에서 처리)
  }

  protected applyOscillatorType(type: Tone.ToneOscillatorType): void {
    if (this.disposed) return;
  this.melodySynth?.set({ oscillator: { type } } as Partial<Tone.SynthOptions>);
  }

  public dispose(): void {
    if (this.disposed) return;
    
    // 모든 오디오 컴포넌트 정리
    this.melodySynth?.dispose();
    this.melodyFilter?.dispose();
    this.vibrato?.dispose();
    this.chorus?.dispose();
    this.compressor?.dispose();
    this.distortion?.dispose();
    
    super.dispose();
  // MelodyInstrument disposed: this.id
  }
}
