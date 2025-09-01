// BassInstrument - 베이스 전용 악기 (독립 구현)
// MonoSynth + SubOscillator로 깊고 펀치있는 베이스 사운드를 생성합니다.
// SONA 지침: BASS 역할 - range 28..52, cutoff ≤ 3kHz, stereo_width ≤ 0.4, reverb_send ≤ 0.15

import * as Tone from 'tone';
import type { InstrumentRole, PlanetPhysicalProperties, MappedAudioParameters } from '../../types/audio';
import { mapPlanetToAudio } from '../utils/mappers';
import type { Instrument } from './InstrumentInterface';

export class BassInstrument implements Instrument {
  private id: string;
  private role: InstrumentRole = 'BASS';
  private disposed = false;
  
  // 베이스 전용 신스와 이펙트 체인
  private bassSynth!: Tone.MonoSynth;        // 메인 베이스 신스 (MonoSynth - 단음 연주에 최적화)
  private subOscillator!: Tone.Oscillator;   // 서브 오실레이터 (더 깊은 저음 생성)
  private bassFilter!: Tone.Filter;          // 로우패스 필터 (따뜻한 베이스 톤)
  private compressor!: Tone.Compressor;      // 컴프레서 (펀치있는 사운드)
  private distortion!: Tone.Distortion;      // 가벼운 디스토션 (따뜻한 새추레이션)

  constructor(id: string = 'bass') {
    this.id = id;
    this.initializeInstrument();
  }

  private initializeInstrument(): void {
    // 베이스 전용 MonoSynth 설정 - 단음 연주에 최적화된 신디사이저
    this.bassSynth = new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth' // 톱니파 - 풍부한 하모닉스로 따뜻한 베이스 톤
      },
      envelope: {
        attack: 0.01,   // 빠른 어택 - 펀치있는 시작
        decay: 0.3,     // 적당한 디케이
        sustain: 0.7,   // 긴 서스테인 - 베이스라인 유지
        release: 1.2    // 부드러운 릴리즈
      },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.4,
        sustain: 0.5,
        release: 0.8,
        baseFrequency: 80, // 낮은 주파수에서 시작 (한 옥타브 낮춤: 150 → 80Hz)
        octaves: 2
      }
    });

    // 서브 오실레이터 - 더 깊은 저음을 위한 보조 신디사이저
    this.subOscillator = new Tone.Oscillator({
      frequency: 20,   // 기본 저음 주파수 (한 옥타브 낮춤: 40 → 20Hz)
      type: 'sine',    // 사인파 - 깨끗하고 깊은 저음
      volume: -10      // 서브 오실레이터 볼륨 증가 (-12 → -10dB)
    });

    // 베이스 전용 로우패스 필터 - 고음을 제거하여 따뜻한 톤 생성
    this.bassFilter = new Tone.Filter({
      frequency: 600,     // SONA 지침: BASS cutoff ≤ 3kHz (더 어둡게: 800 → 600Hz)
      type: 'lowpass',    // 로우패스 - 고음 제거
      rolloff: -24,       // steep rolloff로 고음 완전 제거
      Q: 2                // 적당한 레조넌스
    });

    // 베이스 전용 컴프레서 - 펀치있고 일정한 사운드
    this.compressor = new Tone.Compressor({
      threshold: -15,     // 컴프레션 시작점
      ratio: 6,           // 강한 컴프레션 (베이스 특성상)
      attack: 0.002,      // 빠른 어택
      release: 0.1        // 짧은 릴리즈
    });

    // 베이스 전용 디스토션 - 따뜻한 새추레이션
    this.distortion = new Tone.Distortion({
      distortion: 0.3,    // 가벼운 디스토션
      oversample: '4x'    // 고품질 오버샘플링
    });

    // 신호 체인 연결: bassSynth → compressor → bassFilter → distortion → destination
    this.bassSynth.chain(this.compressor, this.bassFilter, this.distortion, Tone.Destination);
    
    // 서브 오실레이터도 같은 이펙트 체인을 거쳐서 출력
    this.subOscillator.chain(this.compressor, this.bassFilter, Tone.Destination);

    console.log('🎸 BassInstrument 초기화 완료:', this.id);
  }

  // Instrument 인터페이스 구현
  getId(): string { return this.id; }
  getRole(): InstrumentRole { return this.role; }
  isDisposed(): boolean { return this.disposed; }

  updateFromPlanet(props: PlanetPhysicalProperties): void {
    if (this.disposed) return;
    
    // 행성 속성을 오디오 파라미터로 변환
    const mappedParams = mapPlanetToAudio(this.role, props);
    this.applyParams(mappedParams);
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
      
      // 서브 오실레이터 주파수 설정 (메인 주파수의 절반 - 한 옥타브 아래)
      this.subOscillator.frequency.setValueAtTime(frequency / 4, currentTime); // 두 옥타브 아래로 변경 (더 깊은 저음)
      
      // 노트 지속 시간 계산 후 서브 오실레이터 정지
      const noteDurationSeconds = typeof duration === 'string' ? Tone.Time(duration).toSeconds() : duration;
      const currentTimeSeconds = typeof currentTime === 'number' ? currentTime : Tone.Time(currentTime).toSeconds();
      const stopTime = currentTimeSeconds + noteDurationSeconds;
      this.subOscillator.stop(stopTime);
      
      // 메인 베이스 신스 트리거
      this.bassSynth.triggerAttackRelease(note, duration, currentTime, vel);
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
  private applyParams(params: MappedAudioParameters): void {
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
    
    // 디스토션 양 조절 (거리감과 반비례)
    if (this.distortion) {
      const distortionAmount = 0.1 + ((1 - params.reverbSend) * 0.4);
      this.distortion.distortion = Math.min(0.5, distortionAmount);
    }
    
    // 서브 오실레이터 볼륨 조절
    if (this.subOscillator) {
      const subVolume = -12 + (params.outGainDb * 0.4); // 서브 오실레이터 볼륨 증가
      this.subOscillator.volume.rampTo(Math.max(-18, Math.min(-6, subVolume)), 0.08); // 범위 조정
    }
    
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

  public dispose(): void {
    if (this.disposed) return;
    
    // 모든 오디오 컴포넌트 정리
    this.bassSynth?.dispose();
    this.subOscillator?.dispose();
    this.bassFilter?.dispose();
    this.compressor?.dispose();
    this.distortion?.dispose();
    
    this.disposed = true;
    console.log(`🗑️ BassInstrument ${this.id} disposed`);
  }
}
