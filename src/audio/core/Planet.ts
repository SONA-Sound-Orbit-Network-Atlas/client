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
import { 
  initializePropertiesFromConfig
} from '../utils/parameterConfig';

export class Planet {
  private id: string;
  private name: string;
  private role: InstrumentRole;
  private instrument: Instrument;
  private isPlaying = false;
  private star: Star;
  private currentPattern: { steps: number[]; accents: number[] } | null = null;
  private patternParams: PatternParameters | null = null;
  private lastPatternUpdate = 0;
  private properties!: PlanetPhysicalProperties;

  constructor(role: InstrumentRole, star: Star, customId?: string) {
    this.id = customId || `planet-${role}-${Date.now()}`;
    this.name = `${role} Planet`;
    this.role = role;
    this.star = star;
    this.instrument = this.createInstrumentForRole(role);
    this.initializeProperties();
    this.updateInstrument();
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
      this.instrument.updateFromPlanet(this.properties);
    } catch (error) {
      console.error(`❌ ${this.name} 인스트루먼트 업데이트 실패:`, error);
    }
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

    this.star.addClockListener(this.id, (beat, bar, sixteenth) => {
      this.onClockTick(beat, bar, sixteenth);
    });

    this.star.startClock();
    this.isPlaying = true;
  }

  private onClockTick(_beat: number, bar: number, sixteenth: number): void {
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

        this.instrument.triggerAttackRelease(quantizedNote, duration, undefined, velocity);
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
    return {
      pulses: Math.floor(2 + this.properties.orbitSpeed * 14),
      steps: 16,
      rotation: Math.floor((this.properties.inclination + 180) / 360 * 16),
      swingPct: this.properties.eccentricity * 100,
      accentDb: this.properties.eccentricity * 2,
      gateLen: 0.35 + (this.properties.distanceFromStar - 1.0) / (20.0 - 1.0) * 0.5,
      phase: this.properties.tilt,
      eccentricity: this.properties.eccentricity * 100,
    };
  }

  private calculateVelocity(isAccent: boolean): number {
    const accentDb = (this.properties.eccentricity / 0.9) * 2;
    const baseVelocity = isAccent ? 0.8 : 0.6;
    const accentBoost = isAccent ? accentDb / 10 : 0;
    return Math.min(1.0, baseVelocity + accentBoost);
  }

  stopPattern(): void {
    if (!this.isPlaying) return;
    
    this.star.removeClockListener(this.id);
    this.isPlaying = false;
    this.currentPattern = null;
    this.patternParams = null;
  }

  private generateNoteForStep(stepIdx: number): string {
    const scaleNotes = this.star.getScaleNotes();
    const baseMidiByRole: Record<InstrumentRole, number> = {
      BASS: 40, CHORD: 60, MELODY: 72, ARPEGGIO: 72, PAD: 60, DRUM: 36,
    };

    const baseMidi = baseMidiByRole[this.role];
    const octaveShift = Math.floor((this.properties.inclination + 180) / 180) - 1;
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
      case 'MELODY':
        noteIndex = this.properties.planetColor % 100 < 70 
          ? currentChord[stepIdx % 3]
          : (stepIdx + Math.floor(this.properties.tilt / 45)) % scaleNotes.length;
        rawMidi = center + scaleNotes[noteIndex % scaleNotes.length];
        rawMidi = Math.max(55, Math.min(84, rawMidi));
        break;
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
    this.stopPattern();
    this.instrument.dispose();
  }
}
