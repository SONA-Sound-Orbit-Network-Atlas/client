// StellarSystem - 항성계 관리 클래스
// Star(항성)와 Planet(행성)들을 통합 관리합니다.

import type { InstrumentRole, PlanetPhysicalProperties } from '../../types/audio';
import { Star } from './Star';
import { Planet } from './Planet';
import { AudioEngine } from './AudioEngine';

export class StellarSystem {
  private static _instance: StellarSystem | null = null;
  
  private star: Star;
  private planets = new Map<string, Planet>();
  private audioEngine: AudioEngine;
  
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

  // === 랜덤 시드 관리 ===
  setSeed(seed: number | string): void {
    this.star.setSeed(seed);
    console.log(`🌱 StellarSystem Seed 설정 (Star로 위임): ${seed}`);
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
    
    console.log('🌌 StellarSystem 초기화 완료');
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
  addPlanet(role: InstrumentRole, customId?: string): string {
    const planet = new Planet(role, this.star, customId); // Star 인스턴스 주입
    const planetId = planet.getId();
    
    this.planets.set(planetId, planet);
    
    console.log(`🪐 행성 추가됨: ${planet.getName()} (${planetId})`);
    return planetId;
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
    
    console.log(`🗑️ 행성 제거됨: ${planet.getName()}`);
    return true;
  }
  
  // 행성 속성 업데이트
  updatePlanetProperty(planetId: string, property: keyof PlanetPhysicalProperties, value: number): boolean {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }
    
    planet.updateProperty(property, value);
    return true;
  }
  
  // 행성 여러 속성 업데이트
  updatePlanetProperties(planetId: string, props: Partial<PlanetPhysicalProperties>): boolean {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }
    
    planet.updateProperties(props);
    return true;
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
      return false; // 정지됨
    } else {
      try {
        await planet.startPattern();
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
    console.log('⏹️ 모든 행성 패턴 정지');
  }
  
  // === 조회 메서드 ===
  
  // 행성 목록 조회
  getPlanets(): Array<{
    id: string;
    name: string;
    role: InstrumentRole;
    properties: PlanetPhysicalProperties;
    isPlaying: boolean;
  }> {
    return Array.from(this.planets.values()).map(planet => ({
      id: planet.getId(),
      name: planet.getName(),
      role: planet.getRole(),
      properties: planet.getProperties(),
      isPlaying: planet.getIsPlaying()
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
      isPlaying: planet.getIsPlaying()
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
    console.log('🌌 StellarSystem 정리됨');
  }
  
  // 시스템 상태 디버깅
  debug(): void {
    console.log('🌌 StellarSystem Debug Info:');
    console.log('📊 통계:');
    console.log(`  - 총 행성 수: ${this.getTotalPlanetsCount()}`);
    console.log(`  - 재생 중인 행성: ${this.getPlayingPlanetsCount()}`);
    
    console.log('⭐ 항성 상태:');
    this.star.debug();
    
    console.log('🪐 행성 목록:');
    Array.from(this.planets.values()).forEach(planet => {
      console.log(`  - ${planet.getName()} (${planet.getId()}): ${planet.getIsPlaying() ? '재생중' : '정지'}`);
    });
  }
}
