// BassInstrument - 베이스 전용 악기 (독립 구현)
// MonoSynth + SubOscillator로 깊고 펀치있는 베이스 사운드를 생성합니다.
// SONA 지침: BASS 역할 - range 28..52, cutoff ≤ 3kHz, stereo_width ≤ 0.4, reverb_send ≤ 0.15

import * as Tone from 'tone';
import type { MappedAudioParameters } from '../../types/audio';
import { AudioEngine } from '../core/AudioEngine';
import { AbstractInstrumentBase } from './InstrumentInterface';

export class BassInstrument extends AbstractInstrumentBase {
  
  // 베이스 전용 신스와 이펙트 체인
  private bassSynth!: Tone.MonoSynth;        // 메인 베이스 신스 (MonoSynth - 단음 연주에 최적화)
  private subOscillator!: Tone.Oscillator;   // 서브 오실레이터 (더 깊은 저음 생성)
  private bassFilter!: Tone.Filter;          // 로우패스 필터 (따뜻한 베이스 톤)
  private compressor!: Tone.Compressor;      // 컴프레서 (펀치있는 사운드)
  private distortion!: Tone.Distortion;      // 가벼운 디스토션 (따뜻한 새추레이션)
  private panner!: Tone.Panner;              // 팬
  private stereo!: Tone.StereoWidener;       // 스테레오 폭(베이스는 낮게)
  private sendRev!: Tone.Gain;               // 리버브 센드
  private sendDly!: Tone.Gain;               // 딜레이 센드

  constructor(id: string = 'bass') {
    super('BASS', id);
    this.initializeInstrument();
  }

  private initializeInstrument(): void {
    // 베이스 전용 MonoSynth 설정 - 단음 연주에 최적화된 신디사이저
    this.bassSynth = new Tone.MonoSynth({
      oscillator: {
        type: 'sine' // 더 부드럽고 둔탁한 저음을 위해 사인파로 변경
      },
      envelope: {
        attack: 0.02,   // 살짝 느린 어택으로 클릭성 완화
        decay: 0.6,     // 느린 디케이로 더 부드럽게
        sustain: 0.8,   // 유지량 증가
        release: 1.6    // 릴리즈 연장으로 연결감 향상
      },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.4,
        sustain: 0.5,
        release: 0.8,
        baseFrequency: 50, // 더욱 낮은 컷오프 시작으로 둔탁함 증가
        octaves: 3
      }
    });

    // 서브 오실레이터 - 더 깊은 저음을 위한 보조 신디사이저
    this.subOscillator = new Tone.Oscillator({
      frequency: 20,   // 서브는 매우 낮은 주파수
      type: 'sine',    // 사인파 - 깨끗하고 깊은 저음
      volume: -6       // 서브 볼륨을 더 올려 베이스 존재감 강화
    });

    // 베이스 전용 로우패스 필터 - 고음을 제거하여 따뜻한 톤 생성
    this.bassFilter = new Tone.Filter({
      frequency: 350,     // 컷오프를 더 낮춰 날카로운 고음 제거
      type: 'lowpass',    // 로우패스 - 고음 제거
      rolloff: -24,       // steep rolloff로 고음 완전 제거
      Q: 0.9              // 레조넌스 줄여 뾰족함 완화
    });

    // 베이스 전용 컴프레서 - 부드럽게 다듬기
    this.compressor = new Tone.Compressor({
      threshold: -18,     // 컴프레션 시작점 낮춤
      ratio: 3,           // 과한 컴프레션 완화
      attack: 0.006,      // 어택을 조금 느리게 하여 클릭성 완화
      release: 0.18       // 릴리즈 연장
    });

    // 베이스 전용 디스토션 - 매우 약한 새추레이션
    this.distortion = new Tone.Distortion({
      distortion: 0.04,   // 거의 느껴지지 않는 새추레이션
      oversample: '2x'
    });

  // 추가 유틸 노드 및 버스 연결
  this.panner = new Tone.Panner(0);
  this.stereo = new Tone.StereoWidener(0.12);
    this.sendRev = new Tone.Gain(0);
    this.sendDly = new Tone.Gain(0);

    const fx = AudioEngine.instance.getEffectNodes();
    this.sendRev.connect(fx.reverb!);
    this.sendDly.connect(fx.delay!);

    // 신호 체인 연결: bassSynth → compressor → bassFilter → distortion → panner → stereo → destination
    AudioEngine.instance.ensureMasterChain();
    const dest = AudioEngine.instance.masterInput ?? Tone.getDestination();
    // 순서: bassSynth -> distortion -> compressor -> bassFilter -> panner -> stereo -> dest
    this.bassSynth.chain(this.distortion, this.compressor, this.bassFilter, this.panner, this.stereo, dest);

    // 서브 오실레이터도 같은 체인 경로로 출력 (디스토션은 서브에도 적당히 적용)
    this.subOscillator.chain(this.distortion, this.compressor, this.bassFilter, this.panner, this.stereo, dest);

    // 센드 분기(디스토션 전의 타이트한 신호를 선호하면 위치 조절 가능)
    this.bassFilter.connect(this.sendRev);

  // BassInstrument initialized: this.id
  }

  public triggerAttackRelease(
    notes: string | string[], 
    duration: string | number, 
    time?: Tone.Unit.Time, 
    velocity?: number
  ): void {
    if (this.disposed || !this.bassSynth || !this.subOscillator) {
      console.warn('BassInstrument: 신스가 초기화되지 않았거나 폐기되었습니다.');
      return;
    }

    const currentTime = time || Tone.now();
    const vel = velocity || 0.8;
    
    // 베이스는 단음만 연주 (마지막 노트만 사용)
    const note = Array.isArray(notes) ? notes[notes.length - 1] : notes;
    
    try {
      const frequency = Tone.Frequency(note).toFrequency();
      
      // 서브 오실레이터 시작 (필요시)
      if (this.subOscillator.state === 'stopped') {
        this.subOscillator.start(currentTime);
      }
      
  // 서브 오실레이터 주파수 설정 (메인 주파수의 1/4 - 두 옥타브 아래)
  this.subOscillator.frequency.setValueAtTime(frequency / 4, currentTime);
      
      // 노트 지속 시간 계산 후 서브 오실레이터 정지
  // 베이스 노트 길이를 살짝 늘려 연결감 향상 (최소 0.4s)
  const noteDurationSecondsRaw = typeof duration === 'string' ? Tone.Time(duration).toSeconds() : Number(duration);
  const noteDurationSeconds = Math.max(noteDurationSecondsRaw, 0.4);
  const currentTimeSeconds = typeof currentTime === 'number' ? currentTime : Tone.Time(currentTime).toSeconds();
  const stopTime = currentTimeSeconds + noteDurationSeconds;
      this.subOscillator.stop(stopTime);
      
      // 메인 베이스 신스 트리거
  // triggerAttackRelease은 string|number 허용 - 여기서는 seconds 단위 숫자를 전달
  this.bassSynth.triggerAttackRelease(note, noteDurationSeconds, currentTime, vel);
    } catch (error) {
      console.error('BassInstrument triggerAttackRelease 오류:', error);
    }
  }

  // 베이스 전용 메서드들
  
  // 슬랩 기법 - 빠르고 강한 어택으로 펀치있는 사운드
  public slap(note: string, velocity = 0.9): void {
    if (this.disposed) return;
    
    try {
      const frequency = Tone.Frequency(note).toFrequency();
      const currentTime = Tone.now();
      
      if (this.subOscillator.state === 'stopped') {
        this.subOscillator.start(currentTime);
      }
      
      this.subOscillator.frequency.setValueAtTime(frequency / 4, currentTime); // 두 옥타브 아래로 변경
      
      // 짧은 지속시간으로 슬랩 효과
      const stopTime = currentTime + Tone.Time('16n').toSeconds();
      this.subOscillator.stop(stopTime);
      
      this.bassSynth.triggerAttackRelease(note, '16n', currentTime, velocity);
    } catch (error) {
      console.error('BassInstrument slap 오류:', error);
    }
  }

  // 그루브 연주 - 여러 노트를 연속으로 연주
  public groove(notes: string[], timing: string[] = ['8n', '8n', '8n', '8n']): void {
    if (this.disposed) return;
    
    notes.forEach((note, index) => {
      const time = Tone.now() + index * Tone.Time(timing[index] || '8n').toSeconds();
      this.triggerAttackRelease(note, timing[index] || '8n', time, 0.75);
    });
  }

  // SONA 매핑된 파라미터 적용
  protected handleParameterUpdate(
  params: MappedAudioParameters
  ): void {
    if (this.disposed) return;

    // 필터 컷오프 조절 (SONA 지침: BASS cutoff ≤ 3kHz)
    if (this.bassFilter) {
      const cutoff = Math.max(60, Math.min(2000, params.cutoffHz * 0.5)); // 베이스 범위로 제한 (더 어둡게)
      this.bassFilter.frequency.rampTo(cutoff, 0.04); // 40ms 스무딩
    }
    
    // 필터 레조넌스 조절
    if (this.bassFilter) {
      const resonance = 1 + (params.resonanceQ * 3); // 1-4 범위
      this.bassFilter.Q.rampTo(resonance, 0.04);
    }
    
    // 디스토션 양 조절 (거리감과 반비례) - 매우 보수적으로 적용
    if (this.distortion) {
      const distortionAmount = 0.02 + ((1 - (params.reverbSend ?? 0)) * 0.08);
      this.distortion.distortion = Math.max(0.001, Math.min(0.06, distortionAmount));
    }
    
    // 서브 오실레이터 볼륨 조절
    if (this.subOscillator) {
      const subVolume = -12 + (params.outGainDb * 0.4); // 서브 오실레이터 볼륨 증가
      this.subOscillator.volume.rampTo(Math.max(-18, Math.min(-6, subVolume)), 0.08); // 범위 조정
    }

    // 팬/스테레오/버스 센드(베이스는 제한적)
    if (this.panner) this.panner.pan.rampTo(Math.max(-0.35, Math.min(0.35, params.pan ?? 0)), 0.05);
  if (this.stereo) this.stereo.width.rampTo(Math.max(0, Math.min(0.25, params.stereoWidth ?? 0.12)), 0.08);
    if (this.sendRev) this.sendRev.gain.rampTo(Math.max(0, Math.min(0.2, params.reverbSend ?? 0)), 0.12);
    if (this.sendDly) this.sendDly.gain.rampTo(Math.max(0, Math.min(0.2, (params.delayFeedback ?? 0) * 0.6)), 0.12);
    
    // 엔벨로프 어택 조절
    if (this.bassSynth) {
      const attack = 0.005 + ((1 - params.tremDepth) * 0.02);
      this.bassSynth.envelope.attack = attack;
    }
    
    // 필터 엔벨로프 강도 조절
    if (this.bassSynth) {
      const filterEnvAmount = 0.5 + (params.cutoffHz / 2000);
      this.bassSynth.filterEnvelope.octaves = Math.max(0.5, Math.min(3, filterEnvAmount));
    }

    // SONA 지침: BASS stereo_width ≤ 0.4, reverb_send ≤ 0.15 적용
    // (전역 이펙트에서 처리)
  }

  protected applyOscillatorType(type: Tone.ToneOscillatorType): void {
    if (this.disposed) return;
  this.bassSynth?.set({ oscillator: { type } } as Partial<Tone.SynthOptions>);
    if (this.subOscillator) {
      this.subOscillator.type = type as Tone.ToneOscillatorType;
    }
  }

  public dispose(): void {
    if (this.disposed) return;
    
    // 모든 오디오 컴포넌트 정리
    this.bassSynth?.dispose();
    this.subOscillator?.dispose();
    this.bassFilter?.dispose();
    this.compressor?.dispose();
    this.distortion?.dispose();
    
    super.dispose();
  // BassInstrument disposed: this.id
  }
}
