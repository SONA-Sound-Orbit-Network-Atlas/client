import type {
  InstrumentRole,
  PlanetPhysicalProperties,
  PatternParameters,
} from '../../types/audio';
import type { Instrument } from '../instruments/InstrumentInterface';
import * as Tone from 'tone';
import {
  getDefaultSynthType,
  getDefaultOscillatorType,
  type SynthTypeId,
  type OscillatorTypeId,
} from '../instruments/InstrumentInterface';
import { BassInstrument } from '../instruments/BassInstrument';
import { DrumInstrument } from '../instruments/DrumInstrument';
import { ChordInstrument } from '../instruments/ChordInstrument';
import { MelodyInstrument } from '../instruments/MelodyInstrument';
import { ArpeggioInstrument } from '../instruments/ArpeggioInstrument';
import { PadInstrument } from '../instruments/PadInstrument';
import { Star } from '../core/Star';
import { PLANET_PROPERTIES } from '../../types/planetProperties';
import { generateAdvancedPattern } from '../utils/advancedPattern';
import { 
  initializePropertiesFromConfig
} from '../utils/parameterConfig';

export type PlanetSynthConfig = {
  synthType?: SynthTypeId;
  oscillatorType?: OscillatorTypeId;
};

export class Planet {
  private id: string;
  private name: string;
  private role: InstrumentRole;
  private instrument: Instrument;
  private isPlaying = false;
  private star: Star;
  private tempoMultiplier = 1;
  private currentPattern: { steps: number[]; accents: number[] } | null = null;
  private patternParams: PatternParameters | null = null;
  private lastPatternUpdate = 0;
  private properties!: PlanetPhysicalProperties;
  private synthType: SynthTypeId;
  private oscillatorType: OscillatorTypeId;

  constructor(
    role: InstrumentRole,
    star: Star,
    customId?: string,
    config?: PlanetSynthConfig
  ) {
    this.id = customId || `planet-${role}-${Date.now()}`;
    this.name = `${role} Planet`;
    this.role = role;
    this.star = star;
    const resolvedSynth = config?.synthType ?? getDefaultSynthType(role);
    this.synthType = resolvedSynth;
    this.oscillatorType = config?.oscillatorType ?? getDefaultOscillatorType(role, resolvedSynth);
    this.instrument = this.createInstrumentForRole(role);
    this.initializeProperties();
    this.updateInstrument();
    // Star BPM 구독: BPM 변경 시 패턴 파라미터 재계산
    this.star.addBpmListener((bpm) => {
      try {
        // 기준 BPM 120으로 나눈 배수를 사용
        this.tempoMultiplier = bpm / 120;
        console.log(`🪐 ${this.name} BPM 리스너 수신: bpm=${bpm} tempoMultiplier=${this.tempoMultiplier.toFixed(2)}`);
        if (this.isPlaying) {
          // 재계산: 패턴 파라미터 재생성 및 타이밍 업데이트
          this.patternParams = this.calculatePatternParams();
          this.regeneratePattern();
        }
      } catch (err) {
        console.warn('Planet BPM listener error', err);
      }
    });
    console.log(`🪐 ${this.name} 생성됨 (ID: ${this.id})`);
  }

  private initializeProperties(): void {
    const rng = this.star.getDomainRng(`planet-init-${this.role}`);
    
    // 새로운 설정 기반 시스템 사용
    const configBasedProperties = initializePropertiesFromConfig(rng);
    this.properties = configBasedProperties as unknown as PlanetPhysicalProperties;
    
    console.log(`🪐 ${this.name} 초기 속성 (설정 기반):`, this.properties);
  }

  private createInstrumentForRole(role: InstrumentRole): Instrument {
    switch (role) {
      case 'BASS': return new BassInstrument(this.id);
      case 'DRUM': return new DrumInstrument(this.id);
      case 'CHORD': return new ChordInstrument(this.id);
      case 'MELODY': return new MelodyInstrument(this.id);
      case 'ARPEGGIO': return new ArpeggioInstrument(this.id);
      case 'PAD': return new PadInstrument(this.id);
      default: throw new Error(`Unknown instrument role: ${role}`);
    }
  }

  updateProperty(key: keyof PlanetPhysicalProperties, value: number): void {
    this.properties[key] = value;
    this.updateInstrument();
  }

  updateProperties(props: Partial<PlanetPhysicalProperties>): void {
    Object.assign(this.properties, props);
    this.updateInstrument();
  }

  private updateInstrument(): void {
    if (!this.instrument || this.instrument.isDisposed()) {
      return;
    }
    
    // 새로운 파라미터 시스템 직접 사용 (레거시 변환 없이)
    try {
      console.log(`🎵 ${this.name} 악기 속성 업데이트:`, this.properties);
      this.instrument.updateFromPlanet(this.properties, {
        synthType: this.synthType,
        oscillatorType: this.oscillatorType,
      });
    } catch (error) {
      console.error(`❌ ${this.name} 인스트루먼트 업데이트 실패:`, error);
    }
  }

  public updateSynthSettings(settings: PlanetSynthConfig): void {
    let changed = false;

    if (settings.synthType && settings.synthType !== this.synthType) {
      this.synthType = settings.synthType;
      this.oscillatorType = settings.oscillatorType
        ? settings.oscillatorType
        : getDefaultOscillatorType(this.role, this.synthType);
      changed = true;
    }

    if (
      settings.oscillatorType &&
      settings.oscillatorType !== this.oscillatorType
    ) {
      this.oscillatorType = settings.oscillatorType;
      changed = true;
    }

    if (changed) {
      this.updateInstrument();
    }
  }

  public getSynthSettings(): Required<PlanetSynthConfig> {
    return {
      synthType: this.synthType,
      oscillatorType: this.oscillatorType,
    };
  }

  async startPattern(): Promise<void> {
    if (this.isPlaying) {
      return;
    }

    this.patternParams = this.calculatePatternParams();
    const rng = this.star.getDomainRng(`pattern-${this.id}`);
    const generatedPattern = generateAdvancedPattern(
      this.patternParams, 
      this.role, 
      this.star.getGlobalState().complexity,
      rng
    );
    
    this.currentPattern = {
      steps: generatedPattern.steps,
      accents: generatedPattern.accents,
    };

    this.star.addClockListener(this.id, (beat, bar, sixteenth, time) => {
      // tempoMultiplier가 적용된 경우 타이밍을 보정하거나 패턴 로직에서 사용
      this.onClockTick(beat, bar, sixteenth, time);
    });

    this.star.startClock();
    this.isPlaying = true;
  }

  private onClockTick(_beat: number, bar: number, sixteenth: number, time: number): void {
    if (!this.isPlaying || !this.currentPattern || this.instrument.isDisposed()) {
      return;
    }

    try {
      if (bar > 0 && bar % 8 === 0 && bar !== this.lastPatternUpdate) {
        this.regeneratePattern();
        this.lastPatternUpdate = bar;
      }

      const stepIdx = sixteenth % 16;
      const patternStep = stepIdx % this.currentPattern.steps.length;

      if (this.currentPattern.steps[patternStep] === 1) {
        const isAccent = this.currentPattern.accents[patternStep] === 1;
        const note = this.generateNoteForStep(stepIdx);
        const velocity = this.calculateVelocity(isAccent);
        const duration = this.getNoteDuration();
        const quantizedNote = this.quantizeNote(note);
        this.instrument.triggerAttackRelease(quantizedNote, duration, time, velocity);
      }
    } catch (error) {
      console.error(`${this.name} 클락 틱 오류:`, error);
    }
  }

  private regeneratePattern(): void {
    if (!this.patternParams) return;

    const rng = this.star.getDomainRng(`pattern-${this.id}`);
    const generatedPattern = generateAdvancedPattern(
      this.patternParams,
      this.role,
      this.star.getGlobalState().complexity,
      rng
    );

    this.currentPattern = {
      steps: generatedPattern.steps,
      accents: generatedPattern.accents,
    };
  }

  private calculatePatternParams(): PatternParameters {
    // 안전한 기본값을 사용해 타입 오류 및 런타임 예외를 방지합니다.
    const orbitSpeed = this.properties.orbitSpeed ?? 0.5;
    const inclination = this.properties.inclination ?? 0;
    const eccentricity = this.properties.eccentricity ?? 0;
    const distanceFromStar = this.properties.distanceFromStar ?? 10.5;
    const tilt = this.properties.tilt ?? 0;

    // tempoMultiplier를 적용하여 pulses 및 gateLen 등의 타이밍 관련 파라미터를 보정
    const basePulses = Math.floor(2 + orbitSpeed * 14);
    const pulses = Math.max(1, Math.round(basePulses * this.tempoMultiplier));
  // distanceFromStar 범위는 중앙의 PLANET_PROPERTIES에서 정의된 값을 사용합니다.
  const minD = PLANET_PROPERTIES.distanceFromStar.min;
  const maxD = PLANET_PROPERTIES.distanceFromStar.max;
  const baseGate = 0.35 + ((distanceFromStar - minD) / (maxD - minD)) * 0.5;
    const gateLen = Math.max(0.05, Math.min(0.95, baseGate / this.tempoMultiplier));

    return {
      pulses,
      steps: 16,
      rotation: Math.floor(((inclination + 180) / 360) * 16),
      swingPct: eccentricity * 100,
      accentDb: eccentricity * 2,
      gateLen,
      phase: tilt,
      eccentricity: eccentricity * 100,
    };
  }

  private calculateVelocity(isAccent: boolean): number {
  const ecc = this.properties.eccentricity ?? 0;
  const accentDb = (ecc / 0.9) * 2;
    const baseVelocity = isAccent ? 0.8 : 0.6;
    const accentBoost = isAccent ? accentDb / 10 : 0;
    return Math.min(1.0, baseVelocity + accentBoost);
  }

  stopPattern(): void {
    if (!this.isPlaying) return;
    
    console.log(`🛑 ${this.name} 패턴 정지 시작...`);
    
    // 1. Star에서 클락 리스너 제거
    this.star.removeClockListener(this.id);
    
    // 2. 악기의 모든 스케줄된 노트 강제 취소
    if (this.instrument && !this.instrument.isDisposed()) {
      try {
        // 악기에서 현재 재생 중인 모든 노트를 강제 정지
        const now = Tone.now();
        
        // 각 악기 타입별로 강제 릴리즈 (타입 안전하게)
        const instrumentWithRelease = this.instrument as unknown as { 
          releaseAll?: (time?: number) => void;
          triggerRelease?: (time?: number) => void;
        };
        
        // releaseAll 메서드가 있으면 사용
        if (instrumentWithRelease.releaseAll) {
          instrumentWithRelease.releaseAll(now);
          console.log(`🛑 ${this.name} releaseAll 호출됨`);
        } else if (instrumentWithRelease.triggerRelease) {
          // releaseAll이 없으면 triggerRelease 사용
          instrumentWithRelease.triggerRelease(now);
          console.log(`🛑 ${this.name} triggerRelease 호출됨`);
        }
      } catch (error) {
        console.warn(`${this.name} 악기 강제 정지 중 오류:`, error);
      }
    }
    
    // 3. 내부 상태 초기화
    this.isPlaying = false;
    this.currentPattern = null;
    this.patternParams = null;
    
    console.log(`🛑 ${this.name} 패턴 정지 완료`);
  }

  private generateNoteForStep(stepIdx: number): string {
    const scaleNotes = this.star.getScaleNotes();
    const baseMidiByRole: Record<InstrumentRole, number> = {
      BASS: 40, CHORD: 60, MELODY: 72, ARPEGGIO: 72, PAD: 60, DRUM: 36,
    };

    const baseMidi = baseMidiByRole[this.role];
  const inclination = this.properties.inclination ?? 0;
  const octaveShift = Math.floor((inclination + 180) / 180) - 1;
    const center = baseMidi + 12 * octaveShift;

    const chordProgression = [[0, 2, 4], [4, 6, 1], [5, 0, 2], [3, 5, 0]];
    const chordIdx = Math.floor(stepIdx / 4) % chordProgression.length;
    const currentChord = chordProgression[chordIdx];

    let noteIndex: number;
    let rawMidi: number;

    switch (this.role) {
      case 'BASS':
        noteIndex = currentChord[0];
        rawMidi = center + scaleNotes[noteIndex % scaleNotes.length];
        rawMidi = Math.max(28, Math.min(52, rawMidi));
        break;
      case 'CHORD':
        noteIndex = currentChord[stepIdx % 3];
        rawMidi = center + scaleNotes[noteIndex % scaleNotes.length];
        break;
      case 'MELODY': {
        // 색상과 틸트 기본값 처리
        const planetColor = this.properties.planetColor ?? 0;
        const tilt = this.properties.tilt ?? 0;
        noteIndex = planetColor % 100 < 70 
          ? currentChord[stepIdx % 3]
          : (stepIdx + Math.floor(tilt / 45)) % scaleNotes.length;
        rawMidi = center + scaleNotes[noteIndex % scaleNotes.length];
        rawMidi = Math.max(55, Math.min(84, rawMidi));
        break;
      }
      case 'ARPEGGIO': {
        const arpPattern = [...currentChord, ...currentChord.slice().reverse()];
        noteIndex = arpPattern[stepIdx % arpPattern.length];
        rawMidi = center + scaleNotes[noteIndex % scaleNotes.length];
        break;
      }
      case 'PAD':
        noteIndex = currentChord[Math.floor(stepIdx / 2) % 3];
        rawMidi = center + scaleNotes[noteIndex % scaleNotes.length];
        break;
      case 'DRUM':
      default:
        return ['C', 'D', 'C', 'D'][stepIdx % 4] + '2';
    }

    if (isNaN(rawMidi)) rawMidi = baseMidi;
    const quantizedMidi = this.star.quantizeNote(rawMidi);
    return this.midiToNoteName(quantizedMidi);
  }

  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getRole(): InstrumentRole { return this.role; }
  getProperties(): PlanetPhysicalProperties { return { ...this.properties }; }
  getIsPlaying(): boolean { return this.isPlaying; }

  private getNoteDuration(): string {
    const durations = { BASS: '4n', CHORD: '2n', PAD: '1n', ARPEGGIO: '16n', DRUM: '16n', MELODY: '8n' };
    return durations[this.role] || '8n';
  }

  private quantizeNote(note: string): string {
    const midiNote = this.noteNameToMidi(note);
    const quantizedMidi = this.star.quantizeNote(midiNote);
    return this.midiToNoteName(quantizedMidi);
  }

  private midiToNoteName(midi: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12);
    const note = noteNames[midi % 12];
    return `${note}${octave}`;
  }

  private noteNameToMidi(noteName: string): number {
    const noteMap: Record<string, number> = {
      C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 
      'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11
    };

    const match = noteName.match(/^([A-G]#?)(\d+)$/);
    if (!match) return 60;

    const [, note, octaveStr] = match;
    const octave = parseInt(octaveStr);
    return octave * 12 + (noteMap[note] || 0);
  }

  dispose(): void {
    console.log(`🗑️ ${this.name} dispose 시작...`);
    
    // 1. 패턴이 재생 중이면 완전히 정지
    if (this.isPlaying) {
      this.stopPattern();
      
      // 약간 대기 후 다시 한 번 확인
      setTimeout(() => {
        if (this.isPlaying) {
          console.warn(`${this.name} 패턴이 여전히 재생 중, 강제 정지`);
          this.isPlaying = false;
          this.currentPattern = null;
          this.patternParams = null;
        }
      }, 50);
    }
    
    // 2. 악기 완전히 dispose
    if (this.instrument && !this.instrument.isDisposed()) {
      try {
        this.instrument.dispose();
        console.log(`🗑️ ${this.name} 악기 dispose 완료`);
      } catch (error) {
        console.warn(`${this.name} 악기 dispose 중 오류:`, error);
      }
    }
    
    console.log(`🗑️ ${this.name} dispose 완료`);
  }
}
