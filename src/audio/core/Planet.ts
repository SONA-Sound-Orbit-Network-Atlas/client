// Planet - 행성 클래스 (악기 인스턴스 관리 + Star 클락 동기화)
// 각 행성은 하나의 악기를 담당하며, SONA 매핑을 통해 속성을 사운드로 변환합니다.
// Star의 중앙 클락에 동기화되어 정확한 타이밍으로 패턴을 재생합니다.

import type {
  InstrumentRole,
  PlanetPhysicalProperties,
  PatternParameters,
} from '../../types/audio';
import type { Instrument } from '../instruments/InstrumentInterface';
import { BassInstrument } from '../instruments/BassInstrument';
import { DrumInstrument } from '../instruments/DrumInstrument';
import { ChordInstrument } from '../instruments/ChordInstrument';
import { MelodyInstrument } from '../instruments/MelodyInstrument';
import { ArpeggioInstrument } from '../instruments/ArpeggioInstrument';
import { PadInstrument } from '../instruments/PadInstrument';
import { Star } from '../core/Star';
import { generateAdvancedPattern } from '../utils/advancedPattern';

export class Planet {
  private id: string;
  private name: string;
  private role: InstrumentRole;
  private instrument: Instrument;
  private isPlaying = false;
  
  // === 의존성 주입: Star 인스턴스 ===
  private star: Star;

  // === Star 클락 동기화 관련 ===
  private currentPattern: { steps: number[]; accents: number[] } | null = null;
  private patternParams: PatternParameters | null = null;
  private lastPatternUpdate = 0;

  // 행성의 물리적 속성 (안전한 초기값 설정)
  private properties: PlanetPhysicalProperties = {
    size: 50 + Math.random() * 50, // 50-100 범위로 안전한 초기값
    brightness: 50 + Math.random() * 50, // 50-100 범위로 안전한 초기값
    distance: 25 + Math.random() * 50, // 25-75 범위로 안전한 초기값
    speed: 30 + Math.random() * 40, // 30-70 범위로 안전한 초기값
    spin: 20 + Math.random() * 60, // 20-80 범위로 안전한 초기값
    eccentricity: 10 + Math.random() * 30, // 10-40 범위로 안전한 초기값
    color: Math.random() * 360, // 0-360도
    tilt: (Math.random() - 0.5) * 120, // -60~60도로 범위 제한
    elevation: (Math.random() - 0.5) * 120, // -60~60도로 범위 제한
    phase: Math.random() * 360, // 0-360도
  };

  constructor(role: InstrumentRole, star: Star, customId?: string) {
    this.id = customId || `planet-${role}-${Date.now()}`;
    this.name = `${role} Planet`;
    this.role = role;
    this.star = star; // 의존성 주입

    // 역할에 따른 전용 악기 생성
    this.instrument = this.createInstrumentForRole(role);

    // 초기 속성 적용
    this.updateInstrument();

    console.log(`🪐 ${this.name} 생성됨 (ID: ${this.id})`);
  }

  // SONA 매핑 시스템 구현 (Tri Hybrid + Dual)
  // 도메인 분리: Pattern=Speed/Phase/Ecc, Pitch=Size/Elevation, Sound=Color/Brightness/Distance/Tilt/Spin
  // Tri(Hybrid): 1속성→3파라미터 / Dual: 1속성→2파라미터

  // 지수 매핑 함수 (mapExp 표기 통일)
  private mapExp(
    normalized: number,
    min: number,
    max: number,
    exponent: number = 2
  ): number {
    const clamped = Math.max(0, Math.min(1, normalized));
    return min * Math.pow(max / min, Math.pow(clamped, exponent));
  }

  // 선형 매핑 함수 (mapLin 표기 통일)
  private mapLin(normalized: number, min: number, max: number): number {
    return min + (max - min) * normalized;
  }

  // 값 제한 함수
  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // 곡선 함수들
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-6 * (x - 0.5)));
  }

  private curve(normalized: number, type: 'exp' | 'log' | 'sigmoid'): number {
    const n = this.clamp(normalized, 0, 1);
    switch (type) {
      case 'exp':
        return Math.pow(n, 2);
      case 'log':
        return Math.sqrt(n);
      case 'sigmoid':
        return this.sigmoid(n);
      default:
        return n;
    }
  }

  // 싱크 값 계산 (1/8 ~ 1/1 범위로 교정)
  private getSyncValue(beats: number): string {
    if (beats >= 4) return '1n'; // whole note
    if (beats >= 2) return '2n'; // half note
    if (beats >= 1) return '4n'; // quarter note
    if (beats >= 0.5) return '8n'; // eighth note
    if (beats >= 0.25) return '16n'; // sixteenth note
    if (beats >= 0.125) return '32n'; // thirty-second note
    return '64n'; // sixty-fourth note
  }

  // (Tri) 음색 중심 속성 매핑 (1→3)
  private mapColorToSound(colorHue: number): {
    wtIndex: number;
    toneTint: number;
    wavefoldAmount: number;
  } {
    const colorN = (colorHue % 360) / 360; // wrap 0-1
    const wtIndex = colorN;
    const toneTint = this.curve(colorN, 'sigmoid');
    const wavefoldAmount = this.mapLin(toneTint, 0.0, 0.6);

    return { wtIndex, toneTint, wavefoldAmount };
  }

  private mapBrightnessToSound(brightness: number): {
    cutoffHz: number;
    outGainDb: number;
    resonanceQ: number;
  } {
    const brightN = brightness / 100;
    const cutoffHz = this.mapExp(brightN, 800, 16000, 3.0);
    const outGainDb = this.mapLin(brightN, -6, 0);
    // Q는 cutoff가 높을 때 소프트니 적용
    const qBase = this.mapLin(brightN, 0.2, 0.7);
    const resonanceQ = this.clamp(
      qBase * (cutoffHz > 1200 ? 1.0 : 0.6),
      0.2,
      0.7
    );

    return { cutoffHz, outGainDb, resonanceQ };
  }

  private mapDistanceToSound(distance: number): {
    reverbSend: number;
    delayBeats: number;
    reverbSize: number;
  } {
    const distN = distance / 100;
    // 역할별 리버브 상한 적용
    const sendMax =
      this.role === 'PAD' ? 0.6 : this.role === 'BASS' ? 0.15 : 0.25;
    const reverbSend = this.curve(distN, 'exp') * sendMax;
    const delayBeats = this.mapLin(distN, 0.25, 1.5);
    const reverbSize = this.mapLin(distN, 0.2, 0.9);

    return { reverbSend, delayBeats, reverbSize };
  }

  private mapTiltToSound(tilt: number): {
    pan: number;
    msBlend: number;
    stereoWidth: number;
  } {
    const tiltN = (tilt + 90) / 180; // -90~90 → 0~1
    const pan = this.mapLin(tiltN, -0.6, 0.6); // 범위 교정 -1→-0.6
    const msBlend = this.mapLin(tiltN, 0.3, 0.7);
    // BASS 스테레오 폭 제한
    const widthMax = this.role === 'BASS' ? 0.4 : 1.0;
    const stereoWidth = this.mapLin(tiltN, 0.2, widthMax);

    return { pan, msBlend, stereoWidth };
  }

  private mapSpinToSound(spin: number): {
    tremHz: number;
    tremDepth: number;
    chorusDepth: number;
  } {
    const spinN = spin / 100;
    const tremHz = this.mapExp(spinN, 0.5, 8.0, 2.0);
    // ARPEGGIO trem 상한 적용
    const tremHzLimited =
      this.role === 'ARPEGGIO' ? Math.min(tremHz, 6.0) : tremHz;
    const tremDepth = this.mapLin(spinN, 0.1, 0.4);
    const chorusDepth = this.mapLin(spinN, 0.05, 0.5);

    return { tremHz: tremHzLimited, tremDepth, chorusDepth };
  }

  // (Dual) 멜로디·패턴 중심 속성 매핑 (1→2)
  private mapSizeToPitch(size: number): {
    pitchSemitones: number;
    widthSemi: number;
  } {
    const sizeN = size / 100;
    // mapExp는 양수 범위에서만 사용, 음수 범위는 mapLin 사용
    const pitchSemitones = this.mapLin(sizeN, -7, 7); // -7 to +7 semitones
    const widthSemi = Math.round(this.mapLin(Math.pow(sizeN, 0.6), 5, 19));

    return { pitchSemitones, widthSemi };
  }

  private mapSpeedToPattern(speed: number): {
    rateSync: string;
    pulses: number;
  } {
    const speedN = speed / 100;
    const rateBeats = this.mapLin(speedN, 1 / 8, 1 / 1); // 범위 교정 1/4~1/64 → 1/8~1/1
    const rateSync = this.getSyncValue(rateBeats);
    const pulses = Math.round(this.mapExp(speedN, 2, 16, 2.0));

    return { rateSync, pulses };
  }

  private mapEccentricityToGroove(eccentricity: number): {
    swingPct: number;
    accentDb: number;
  } {
    const eccN = eccentricity / 100;
    const swingPct = this.clamp(eccN * 40, 0, 40); // 범위 교정 0.5 → 40%
    const accentDb = this.mapLin(eccN, 0, 2); // 범위 교정 +2dB

    return { swingPct, accentDb };
  }

  private mapElevationToPitch(elevation: number): {
    octave: number;
    filterTypeMorph: number;
  } {
    const elevN = (elevation + 90) / 180; // -90~90 → 0~1
    const octave = Math.round(this.mapLin(elevN, -1, 1));
    const filterTypeMorph = this.mapLin(elevN, 0, 1); // LP→BP→HP

    return { octave, filterTypeMorph };
  }

  private mapPhaseToPattern(phase: number): {
    rotation: number;
    accentGate: boolean[];
  } {
    const phaseN = (phase % 360) / 360; // wrap 0-1
    const rotation = Math.floor(phaseN * 16); // 0-15

    // Quarter Accent Gate (0/0.25/0.5/0.75에서 액센트)
    const accentGate = Array(16).fill(false);
    const accentPhases = [0, 0.25, 0.5, 0.75];
    accentPhases.forEach((accentPhase) => {
      if (Math.abs(phaseN - accentPhase) < 0.05) {
        // 5% 허용 범위
        const gateIdx = Math.round(accentPhase * 16) % 16;
        accentGate[gateIdx] = true;
      }
    });

    return { rotation, accentGate };
  }

  // 역할별 전용 악기 생성
  private createInstrumentForRole(role: InstrumentRole): Instrument {
    switch (role) {
      case 'BASS':
        return new BassInstrument(this.id);
      case 'DRUM':
        return new DrumInstrument(this.id);
      case 'CHORD':
        return new ChordInstrument(this.id);
      case 'MELODY':
        return new MelodyInstrument(this.id);
      case 'ARPEGGIO':
        return new ArpeggioInstrument(this.id);
      case 'PAD':
        return new PadInstrument(this.id);
      default:
        throw new Error(`Unknown instrument role: ${role}`);
    }
  }

  // 속성 업데이트
  updateProperty(key: keyof PlanetPhysicalProperties, value: number): void {
    this.properties[key] = value;
    this.updateInstrument();
    console.log(`🪐 ${this.name} ${key} → ${value}`);
  }

  // 여러 속성 동시 업데이트
  updateProperties(props: Partial<PlanetPhysicalProperties>): void {
    Object.assign(this.properties, props);
    this.updateInstrument();
  }

  // 악기에 속성 반영
  // 악기에 속성 적용 (새로운 SONA 매핑 시스템 사용)
  private updateInstrument(): void {
    if (!this.instrument || this.instrument.isDisposed()) {
      return;
    }

    console.log(`🔄 ${this.name} SONA 매핑 업데이트 시작...`);

    // === Tri(Hybrid) 매핑 - 음색 중심 속성 (1→3) ===

    // Color → 오실레이터 파라미터
    const colorMapping = this.mapColorToSound(this.properties.color);
    console.log(`🎨 Color 매핑:`, colorMapping);

    // Brightness → 필터 + 볼륨 + 레조넌스
    const brightnessMapping = this.mapBrightnessToSound(
      this.properties.brightness
    );
    console.log(`💡 Brightness 매핑:`, brightnessMapping);

    // Distance → 리버브 + 딜레이 + 리버브 크기
    const distanceMapping = this.mapDistanceToSound(this.properties.distance);
    console.log(`📏 Distance 매핑:`, distanceMapping);

    // Tilt → 팬 + 스테레오 + MS 블렌드
    const tiltMapping = this.mapTiltToSound(this.properties.tilt);
    console.log(`🎯 Tilt 매핑:`, tiltMapping);

    // Spin → 트레몰로 + 뎁스 + 코러스
    const spinMapping = this.mapSpinToSound(this.properties.spin);
    console.log(`🌀 Spin 매핑:`, spinMapping);

    // === Dual 매핑 - 멜로디·패턴 중심 속성 (1→2) ===

    // Size → 피치 오프셋 + 노트 레인지 폭
    const sizeMapping = this.mapSizeToPitch(this.properties.size);
    console.log(`📐 Size 매핑:`, sizeMapping);

    // Speed → 패턴 레이트 + 펄스 개수
    const speedMapping = this.mapSpeedToPattern(this.properties.speed);
    console.log(`⚡ Speed 매핑:`, speedMapping);

    // Eccentricity → 스윙 + 액센트
    const eccentricityMapping = this.mapEccentricityToGroove(
      this.properties.eccentricity
    );
    console.log(`🎭 Eccentricity 매핑:`, eccentricityMapping);

    // Elevation → 옥타브 + 필터 타입 모핑
    const elevationMapping = this.mapElevationToPitch(
      this.properties.elevation
    );
    console.log(`⛰️ Elevation 매핑:`, elevationMapping);

    // Phase → 패턴 로테이션 + 액센트 게이트
    const phaseMapping = this.mapPhaseToPattern(this.properties.phase);
    console.log(`🌙 Phase 매핑:`, phaseMapping);

    // === 악기에 매핑된 값 적용 ===
    // 기존 updateFromPlanet 메서드를 통해 적용 (하위 호환성 유지)
    this.instrument.updateFromPlanet(this.properties);

    console.log(`✅ ${this.name} SONA 매핑 완료!`);
  }

  // 패턴 재생 시작 (Star 클락 기반으로 변경)
  async startPattern(): Promise<void> {
    if (this.isPlaying) {
      console.warn(`${this.name}이 이미 재생 중입니다.`);
      return;
    }

    // 패턴 파라미터 계산 및 고급 패턴 생성
    this.patternParams = this.calculatePatternParams();
    const generatedPattern = generateAdvancedPattern(
      this.patternParams, 
      this.role, 
      this.star.getGlobalState().complexity
    );    this.currentPattern = {
      steps: generatedPattern.steps,
      accents: generatedPattern.accents,
    };

    // Star 클락 리스너 등록
    this.star.addClockListener(
      this.id,
      (beat: number, bar: number, sixteenth: number) => {
        this.onClockTick(beat, bar, sixteenth);
      }
    );

    // Star 클락 시작 (아직 시작되지 않았다면)
    this.star.startClock();

    this.isPlaying = true;
    this.lastPatternUpdate = 0; // 초기값으로 설정

    console.log(`▶️ ${this.name} 패턴 시작 (Star 클락 동기화)`);
  }

  // Star 클락 틱 이벤트 처리
  private onClockTick(beat: number, bar: number, sixteenth: number): void {
    if (
      !this.isPlaying ||
      !this.currentPattern ||
      this.instrument.isDisposed()
    ) {
      return;
    }

    try {
      // 패턴 재생성 체크 (8마디마다)
      if (bar > 0 && bar % 8 === 0 && bar !== this.lastPatternUpdate) {
        this.regeneratePattern();
        this.lastPatternUpdate = bar;
      }

      // 현재 16분음표에 해당하는 패턴 스텝 확인
      const stepIdx = sixteenth % 16;
      const patternStep = stepIdx % this.currentPattern.steps.length;

      // 해당 스텝이 연주되어야 하는지 확인
      if (this.currentPattern.steps[patternStep] === 1) {
        // 액센트 확인
        const isAccent = this.currentPattern.accents[patternStep] === 1;

        // 노트 생성 및 재생
        const note = this.generateNoteForStep(stepIdx);
        const velocity = this.calculateVelocity(isAccent);
        const duration = this.getNoteDuration();

        // 항성의 키/스케일로 양자화
        const quantizedNote = this.quantizeNote(note);

        this.instrument.triggerAttackRelease(
          quantizedNote,
          duration,
          undefined,
          velocity
        );

        console.log(
          `🎵 ${this.name} [${bar}:${beat}:${sixteenth}] ${quantizedNote} vel:${velocity.toFixed(2)} ${isAccent ? 'ACCENT' : ''}`
        );
      }
    } catch (error) {
      console.error(`${this.name} 클락 틱 오류:`, error);
    }
  }

  // 패턴 재생성 (동적 변화)
  private regeneratePattern(): void {
    if (!this.patternParams) return;

    const generatedPattern = generateAdvancedPattern(
      this.patternParams,
      this.role,
      this.star.getGlobalState().complexity
    );

    this.currentPattern = {
      steps: generatedPattern.steps,
      accents: generatedPattern.accents,
    };

    console.log(`♻️ ${this.name} 패턴 재생성:`, {
      pulses: this.currentPattern.steps.filter((x) => x === 1).length,
      accents: this.currentPattern.accents.filter((x) => x === 1).length,
    });
  }

  // Velocity 계산 (Eccentricity 기반)
  private calculateVelocity(isAccent: boolean): number {
    const eccentricityMapping = this.mapEccentricityToGroove(
      this.properties.eccentricity
    );
    const baseVelocity = isAccent ? 0.8 : 0.6;
    const accentBoost = isAccent ? eccentricityMapping.accentDb / 10 : 0;
    return Math.min(1.0, baseVelocity + accentBoost);
  }

  // 패턴 정지 (Star 클락 기반)
  stopPattern(): void {
    if (!this.isPlaying) {
      return;
    }

    this.star.removeClockListener(this.id);

    this.isPlaying = false;
    this.currentPattern = null;
    this.patternParams = null;

    console.log(`⏹️ ${this.name} 패턴 정지 (Star 클락 해제)`);
  }

  // 속성에서 패턴 파라미터 계산 (새로운 SONA 매핑 사용)
  private calculatePatternParams(): PatternParameters {
    const globalState = this.star.getGlobalState();

    // === 새로운 SONA 매핑 시스템 사용 ===

    // Speed → Rate/Density/Pulses
    const speedMapping = this.mapSpeedToPattern(this.properties.speed);

    // Eccentricity → Swing/Accent
    const eccentricityMapping = this.mapEccentricityToGroove(
      this.properties.eccentricity
    );

    // Phase → Rotation/AccentGate
    const phaseMapping = this.mapPhaseToPattern(this.properties.phase);

    // Distance → Gate Length (선택 속성)
    const gateLen = 0.35 + (this.properties.distance / 100) * 0.5; // 0.35-0.85

    // Complexity 적용 (항성 전역 설정)
    const complexityMultiplier = 1 + 0.25 * (globalState.complexity - 1);
    const adjustedPulses = Math.round(
      speedMapping.pulses * complexityMultiplier
    );

    const params: PatternParameters = {
      pulses: this.clamp(adjustedPulses, 1, 16),
      steps: 16,
      rotation: phaseMapping.rotation, // 0-15
      swingPct: eccentricityMapping.swingPct, // 0-40%
      accentDb: eccentricityMapping.accentDb, // 0-2dB
      gateLen: gateLen, // 0.35-0.85
      phase: this.properties.phase, // 0-360 (원본 값 전달)
      eccentricity: this.properties.eccentricity, // 0-100 (원본 값 전달)
    };

    // 역할별 가드레일 적용 (업데이트된 규칙)
    this.applyRoleGuardrails(params);

    console.log(`📊 ${this.name} 패턴 파라미터:`, params);
    return params;
  }

  // 역할별 가드레일 적용 (새로운 지침 적용)
  private applyRoleGuardrails(params: PatternParameters): void {
    switch (this.role) {
      case 'MELODY':
        // LEAD: range 55..84 (노트 생성 시 적용), reverb_send ≤ 0.25, swing ≤ 25%
        params.swingPct = Math.min(25, params.swingPct);
        console.log(`🎼 MELODY 가드레일: swing ≤ 25% (${params.swingPct}%)`);
        break;

      case 'BASS':
        // BASS: range 28..52(옥타브 −1..0), cutoff ≤ 3kHz, stereo_width ≤ 0.4, reverb_send ≤ 0.15
        params.pulses = Math.max(2, Math.min(8, params.pulses)); // 안정적인 패턴
        console.log(`🎸 BASS 가드레일: 안정적 패턴 (pulses: ${params.pulses})`);
        break;

      case 'ARPEGGIO':
        // ARP: pulses 6-16, rotation 2배수 스냅, trem_hz ≤ 6
        params.pulses = Math.max(6, Math.min(16, params.pulses));
        params.rotation = Math.round(params.rotation / 2) * 2;
        console.log(
          `🎹 ARPEGGIO 가드레일: pulses 6-16 (${params.pulses}), rotation 2배수 (${params.rotation})`
        );
        break;

      case 'PAD':
        // PAD: pulses 2-6, gate 0.70-0.95, reverb_size 0.4-0.9
        params.pulses = Math.max(2, Math.min(6, params.pulses));
        params.gateLen = Math.max(0.7, Math.min(0.95, params.gateLen));
        console.log(
          `🌫️ PAD 가드레일: pulses 2-6 (${params.pulses}), gate 0.70-0.95 (${params.gateLen})`
        );
        break;

      case 'DRUM':
        // DRUM: range 미적용(채널 고정), family는 Backbeat/Clave/Dense16/Sparse 우선
        console.log(`🥁 DRUM 가드레일: 고정 채널, Backbeat 패밀리 우선`);
        break;

      case 'CHORD':
        // CHORD: 기본 설정 유지
        console.log(`🎹 CHORD 가드레일: 기본 설정 적용`);
        break;
    }
  }

  // 역할별 노트 생성 (새로운 노트 레인지 계산 규칙 적용)
  private generateNoteForStep(stepIdx: number): string {
    const scaleNotes = this.star.getScaleNotes();

    // === 새로운 노트 레인지 계산 규칙 ===
    // center = baseMidi(역할별) + 12*octave → range = center ± widthSemi/2 → 항성 Key/Scale 양자화 → 역할별 클램프

    // Size/Elevation 매핑 사용
    const sizeMapping = this.mapSizeToPitch(this.properties.size);
    const elevationMapping = this.mapElevationToPitch(
      this.properties.elevation
    );

    // 역할별 기본 MIDI 범위 (baseMidi)
    const baseMidiByRole: Record<InstrumentRole, number> = {
      BASS: 40, // E2 - 28..52 범위
      CHORD: 60, // C4 - 기본 중음역
      MELODY: 72, // C5 - 55..84 범위
      ARPEGGIO: 72, // C5 - 빠른 아르페지오
      PAD: 60, // C4 - 패드 화음
      DRUM: 36, // C2 - 드럼 고정
    };

    const baseMidi = baseMidiByRole[this.role];
    const octaveShift = elevationMapping.octave; // -1..+1
    const center = baseMidi + 12 * octaveShift;
    const widthSemi = sizeMapping.widthSemi; // 5..19

    // 코드 진행 (I-V-vi-IV)
    const chordProgression = [
      [0, 2, 4], // I (1도, 3도, 5도)
      [4, 6, 1], // V (5도, 7도, 2도)
      [5, 0, 2], // vi (6도, 1도, 3도)
      [3, 5, 0], // IV (4도, 6도, 1도)
    ];

    const chordIdx = Math.floor(stepIdx / 4) % chordProgression.length;
    const currentChord = chordProgression[chordIdx];

    let noteIndex: number;
    let rawMidi: number;

    switch (this.role) {
      case 'BASS':
        // 베이스: 루트음 위주
        noteIndex = currentChord[0];
        rawMidi =
          center +
          scaleNotes[noteIndex % scaleNotes.length] +
          sizeMapping.pitchSemitones;
        // BASS 가드레일: 28..52 범위
        rawMidi = this.clamp(rawMidi, 28, 52);
        break;

      case 'CHORD':
        // 코드: 화음 구성음 순환
        noteIndex = currentChord[stepIdx % 3];
        rawMidi =
          center +
          scaleNotes[noteIndex % scaleNotes.length] +
          sizeMapping.pitchSemitones;
        break;

      case 'MELODY':
        // 멜로디: 코드톤 우선, 때때로 스케일톤
        if (this.properties.color % 100 < 70) {
          noteIndex = currentChord[stepIdx % 3];
        } else {
          noteIndex =
            (stepIdx + Math.floor(this.properties.phase / 45)) %
            scaleNotes.length;
        }
        rawMidi =
          center +
          scaleNotes[noteIndex % scaleNotes.length] +
          sizeMapping.pitchSemitones;
        // MELODY 가드레일: 55..84 범위
        rawMidi = this.clamp(rawMidi, 55, 84);
        break;

      case 'ARPEGGIO': {
        // 아르페지오: 빠른 화음 분산
        const arpPattern = [...currentChord, ...currentChord.slice().reverse()];
        noteIndex = arpPattern[stepIdx % arpPattern.length];
        rawMidi =
          center +
          scaleNotes[noteIndex % scaleNotes.length] +
          sizeMapping.pitchSemitones;
        break;
      }

      case 'PAD':
        // 패드: 긴 화음, 느린 변화
        noteIndex = currentChord[Math.floor(stepIdx / 2) % 3];
        rawMidi =
          center +
          scaleNotes[noteIndex % scaleNotes.length] +
          sizeMapping.pitchSemitones;
        break;

      case 'DRUM':
      default: {
        // 드럼: 고정 패턴 (range 미적용)
        const drumNotes = ['C', 'D', 'C', 'D']; // 킥-스네어 패턴
        return `${drumNotes[stepIdx % 4]}2`;
      }
    }

    // 안전장치: NaN 체크 및 기본값 설정
    if (isNaN(rawMidi)) {
      console.warn(`⚠️ ${this.role} rawMidi is NaN, using fallback`);
      rawMidi = baseMidi; // 기본 MIDI 값 사용
    }

    // 항성 Key/Scale로 양자화
    const quantizedMidi = this.star.quantizeNote(rawMidi);

    // MIDI를 노트명으로 변환
    const finalNote = this.midiToNoteName(quantizedMidi);

    // 개선된 디버그 로그
    console.log(
      `🎵 ${this.role} 노트 생성: center=${center}, width=${widthSemi}, raw=${rawMidi}, quantized=${quantizedMidi}, final=${finalNote}`
    );
    console.log(
      `🔍 ${this.role} 디버그: sizeMapping=${JSON.stringify(sizeMapping)}, elevationMapping=${JSON.stringify(elevationMapping)}`
    );

    return finalNote;
  }

  // Getter 메서드들
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getRole(): InstrumentRole {
    return this.role;
  }
  getProperties(): PlanetPhysicalProperties {
    return { ...this.properties };
  }
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // === 유틸리티 메서드들 ===

  // 역할별 노트 지속시간
  private getNoteDuration(): string {
    switch (this.role) {
      case 'BASS':
        return '4n';
      case 'CHORD':
        return '2n';
      case 'PAD':
        return '1n';
      case 'ARPEGGIO':
      case 'DRUM':
        return '16n';
      case 'MELODY':
        return '8n';
      default:
        return '8n';
    }
  }

  // 노트 양자화 (항성 키/스케일 적용)
  private quantizeNote(note: string): string {
    const midiNote = this.noteNameToMidi(note);
    const quantizedMidi = this.star.quantizeNote(midiNote);
    return this.midiToNoteName(quantizedMidi);
  }

  // MIDI 번호를 노트명으로 변환
  private midiToNoteName(midi: number): string {
    const noteNames = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    const octave = Math.floor(midi / 12);
    const note = noteNames[midi % 12];
    return `${note}${octave}`;
  }

  // 노트명을 MIDI 번호로 변환
  private noteNameToMidi(noteName: string): number {
    const noteMap: Record<string, number> = {
      C: 0,
      'C#': 1,
      D: 2,
      'D#': 3,
      E: 4,
      F: 5,
      'F#': 6,
      G: 7,
      'G#': 8,
      A: 9,
      'A#': 10,
      B: 11,
    };

    const match = noteName.match(/^([A-G]#?)(\d+)$/);
    if (!match) return 60; // 기본값 C4

    const [, note, octaveStr] = match;
    const octave = parseInt(octaveStr);

    return octave * 12 + (noteMap[note] || 0);
  }

  // 리소스 정리
  dispose(): void {
    this.stopPattern();
    this.instrument.dispose();
    console.log(`🗑️ ${this.name} 폐기됨`);
  }
}
