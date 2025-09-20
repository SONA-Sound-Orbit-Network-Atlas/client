// StellarSystem - 항성계 관리 클래스
// Star(항성)와 Planet(행성)들을 통합 관리합니다.

import type { InstrumentRole, PlanetPhysicalProperties } from '../../types/audio';
import { Star } from './Star';
import { Planet, type PlanetSynthConfig } from './Planet';
import { AudioEngine } from './AudioEngine';

export class StellarSystem {
  private static _instance: StellarSystem | null = null;
  
  private star: Star;
  private planets = new Map<string, Planet>();
  private audioEngine: AudioEngine;
  private playStateListeners: Set<(isPlaying: boolean) => void> = new Set();
  
  private constructor() {
    this.star = Star.instance;
    this.audioEngine = AudioEngine.instance;
  }
  
  // 싱글톤 패턴
  static get instance(): StellarSystem {
    if (!this._instance) {
      this._instance = new StellarSystem();
    }
    return this._instance;
  }

  // === 재생 상태 이벤트 ===
  private emitPlayState(): void {
    const isPlaying = this.getPlayingPlanetsCount() > 0;
  // StellarSystem play state changed: isPlaying=%s, playingCount=%d
    this.playStateListeners.forEach((cb) => {
      try { 
        cb(isPlaying); 
      } catch (error) {
        console.warn('재생 상태 리스너 오류:', error);
      }
    });
  }

  onPlayStateChange(cb: (isPlaying: boolean) => void): () => void {
    this.playStateListeners.add(cb);
    // 즉시 현재 상태 알림
    const currentState = this.getPlayingPlanetsCount() > 0;
    try { 
      cb(currentState); 
    } catch (error) {
      console.warn('재생 상태 리스너 초기 호출 오류:', error);
    }
    return () => this.playStateListeners.delete(cb);
  }

  // === 랜덤 시드 관리 ===
  setSeed(seed: number | string): void {
    this.star.setSeed(seed);
  // StellarSystem seed delegated to Star: ${seed}
    // 재생 중인 행성 패턴 재생성하여 동일 결과 보장
    Array.from(this.planets.values()).forEach(planet => {
      if (planet.getIsPlaying()) {
        // 행성 내부 regeneratePattern 은 private 이므로 stop/start 방식 사용
        planet.stopPattern();
        planet.startPattern().catch(err => console.error('Seed 재적용 패턴 시작 실패', err));
      }
    });
  }

  getSeed(): number | string | null { return this.star.getSeed(); }
  
  // 오디오 시스템 초기화
  async initialize(): Promise<void> {
    if (!this.audioEngine.isReady()) {
      // 항성의 초기 상태를 AudioEngine 초기화에 전달
      await this.audioEngine.init(this.star.getGlobalState());
    }
    
  // StellarSystem initialized
  }
  
  // === 항성(Star) 관리 ===
  
  // 항성 속성 업데이트
  updateStarProperty(property: 'spin' | 'brightness' | 'color' | 'size', value: number): void {
    this.star.updateProperty(property, value);
  }
  
  // 항성 전체 속성 업데이트  
  updateStarProperties(props: { spin?: number; brightness?: number; color?: number; size?: number }): void {
    this.star.updateProperties(props);
  }
  
  // 항성 상태 조회
  getStarGlobalState() {
    return this.star.getGlobalState();
  }
  
  getStarProperties() {
    return this.star.getProperties();
  }
  
  // === 행성(Planet) 관리 ===
  
  // 새 행성 추가
  addPlanet(role: InstrumentRole, customId?: string, config?: PlanetSynthConfig, initialProperties?: PlanetPhysicalProperties): string {
    const planet = new Planet(role, this.star, customId, config); // Star 인스턴스 주입
    const planetId = planet.getId();

    // 초기 프로퍼티가 주어졌다면 즉시 적용 (스토어에서 생성된 랜덤값을 덮어쓰지 않도록)
    try {
      if (initialProperties) {
        planet.updateProperties(initialProperties);
      }
    } catch (err) {
      console.warn(`초기 행성 프로퍼티 적용 실패: ${planetId}`, err);
    }

    this.planets.set(planetId, planet);

  // Planet added: ${planet.getName()} (${planetId})
    this.emitPlayState();
    return planetId;
  }

  // 새 행성 생성 (addPlanet의 별칭)
  createPlanet(role: InstrumentRole, customId?: string, config?: PlanetSynthConfig, initialProperties?: PlanetPhysicalProperties): string {
    return this.addPlanet(role, customId, config, initialProperties);
  }

  // 항성 전역 상태 업데이트
  updateStarGlobalState(globalState: Partial<import('../../types/audio').StarGlobalState>): void {
    this.star.setGlobalState(globalState);
  }
  
  // 행성 제거
  removePlanet(planetId: string): boolean {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }
    
    planet.dispose();
    this.planets.delete(planetId);
    
  // Planet removed: ${planet.getName()}
    this.emitPlayState();
    return true;
  }
  
  // 행성 속성 업데이트
  updatePlanetProperty(planetId: string, property: keyof PlanetPhysicalProperties, value: number): boolean {

  const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`[StellarSystem] updatePlanetProperty: 행성을 찾을 수 없습니다: ${planetId} (time=${Date.now()}). 현재 StellarSystem.planets keys=${Array.from(this.planets.keys()).join(',')}`);
      // 임시 생성 이전에 호출 스택과 추가 정보를 남깁니다.
      try {
        throw new Error('stack');
      } catch (e) {
        // 스택은 개발 중 디버깅 용도로만 콘솔에 남깁니다.
        console.debug((e as Error).stack);
      }
      // 대상 행성이 없으므로 실패로 반환합니다. (자동 생성은 원치 않음 — 스토어에서 생성 순서를 보장해야 함)
      return false;
    }

    planet.updateProperty(property, value);
    return true;
  }
  
  // 행성 여러 속성 업데이트
  updatePlanetProperties(planetId: string, props: Partial<PlanetPhysicalProperties>): boolean {
  const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`[StellarSystem] updatePlanetProperties: 행성을 찾을 수 없습니다: ${planetId} (time=${Date.now()}). 현재 StellarSystem.planets keys=${Array.from(this.planets.keys()).join(',')}`);
      try { throw new Error('stack'); } catch (e) { console.debug((e as Error).stack); }
      return false;
    }

    if (!props) {
      console.debug(`updatePlanetProperties 호출 시 props가 null/undefined입니다: ${planetId}`);
      return false;
    }

    planet.updateProperties(props);
    return true;
  }

  updatePlanetSynthSettings(planetId: string, settings: PlanetSynthConfig): boolean {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }

    planet.updateSynthSettings(settings);
    return true;
  }

  // 역할(role)을 런타임에 변경합니다. 내부 Planet.changeRole을 호출해 재생 중단을 최소화합니다.
  changePlanetRole(planetId: string, newRole: InstrumentRole, config?: PlanetSynthConfig): boolean {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }

    try {
      // Planet 클래스에 추가된 changeRole 메서드를 호출
      planet.changeRole(newRole, config);
      return true;
    } catch (err) {
      console.error(`행성 역할 변경 실패 (${planetId}):`, err);
      return false;
    }
  }
  
  // === 패턴 재생 관리 ===
  
  // 행성 패턴 시작
  async startPlanetPattern(planetId: string): Promise<boolean> {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }
    
    try {
      await planet.startPattern();
      this.emitPlayState();
      return true;
    } catch (error) {
      console.error(`행성 패턴 시작 실패 (${planetId}):`, error);
      return false;
    }
  }
  
  // 행성 패턴 정지
  stopPlanetPattern(planetId: string): boolean {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }
    
    planet.stopPattern();
    this.emitPlayState();
    return true;
  }
  
  // 행성 패턴 토글
  async togglePlanetPattern(planetId: string): Promise<boolean> {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }
    
    if (planet.getIsPlaying()) {
      planet.stopPattern();
      this.emitPlayState();
      return false; // 정지됨
    } else {
      try {
        await planet.startPattern();
        this.emitPlayState();
        return true; // 시작됨
      } catch (error) {
        console.error(`행성 패턴 토글 실패 (${planetId}):`, error);
        return false;
      }
    }
  }
  
  // 모든 행성 패턴 정지
  stopAllPatterns(): void {
    Array.from(this.planets.values()).forEach(planet => planet.stopPattern());
  // All planet patterns stopped
    this.emitPlayState();
  }


  // 즉시 초기화(짧은 페이드 적용) - 컴포넌트 언마운트 등에서 사용
  async resetImmediate(): Promise<void> {
  // StellarSystem immediate reset (short fade) start
    this.audioEngine.beginTransition();

    try {
      // 아주 짧은 페이드로 어색함을 줄임
      try {
        await this.audioEngine.fadeOutAndStop(1.0);
      } catch (err) {
        console.warn('페이드(1s) 중 오류:', err);
      }

      this.stopAllPatterns();
      Array.from(this.planets.values()).forEach((planet) => {
        try {
          if (planet.getIsPlaying()) {
            planet.stopPattern();
          }
          planet.dispose();
        } catch (error) {
          console.warn('행성 dispose 중 오류:', error);
        }
      });
      this.planets.clear();

      this.star.clearAllClockListeners();
      this.audioEngine.reset();
    } finally {
      this.audioEngine.endTransition();
  // StellarSystem immediate reset complete
    }
  }
  
  // === 조회 메서드 ===
  
  // 행성 목록 조회
  getPlanets(): Array<{
    id: string;
    name: string;
    role: InstrumentRole;
    properties: PlanetPhysicalProperties;
    isPlaying: boolean;
    synthType: string;
    oscillatorType: string;
  }> {
    return Array.from(this.planets.values()).map(planet => ({
      id: planet.getId(),
      name: planet.getName(),
      role: planet.getRole(),
      properties: planet.getProperties(),
      isPlaying: planet.getIsPlaying(),
      synthType: planet.getSynthSettings().synthType,
      oscillatorType: planet.getSynthSettings().oscillatorType,
    }));
  }
  
  // 특정 행성 조회
  getPlanet(planetId: string) {
    const planet = this.planets.get(planetId);
    if (!planet) return null;
    
    return {
      id: planet.getId(),
      name: planet.getName(),
      role: planet.getRole(),
      properties: planet.getProperties(),
      isPlaying: planet.getIsPlaying(),
      synthType: planet.getSynthSettings().synthType,
      oscillatorType: planet.getSynthSettings().oscillatorType,
    };
  }
  
  // 재생 중인 행성 수
  getPlayingPlanetsCount(): number {
    return Array.from(this.planets.values()).filter(planet => planet.getIsPlaying()).length;
  }
  
  // 전체 행성 수
  getTotalPlanetsCount(): number {
    return this.planets.size;
  }
  
  // === 시스템 관리 ===
  
  // 전체 시스템 정리
  dispose(): void {
    this.stopAllPatterns();
    
    Array.from(this.planets.values()).forEach(planet => planet.dispose());
    
    this.planets.clear();
  // StellarSystem disposed
  }
  
  // 시스템 상태 디버깅
  debug(): void {
    // StellarSystem debug info removed to reduce console noise
  }
}
