// StellarSystem - 항성계 관리 클래스
// Star(항성)와 Planet(행성)들을 통합 관리합니다.

import * as Tone from 'tone';
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
    console.log(`🎵 StellarSystem 재생 상태 변경: ${isPlaying ? '재생' : '정지'} (행성 ${this.getPlayingPlanetsCount()}개)`);
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
  addPlanet(role: InstrumentRole, customId?: string, config?: PlanetSynthConfig): string {
    const planet = new Planet(role, this.star, customId, config); // Star 인스턴스 주입
    const planetId = planet.getId();
    
    this.planets.set(planetId, planet);
    
    console.log(`🪐 행성 추가됨: ${planet.getName()} (${planetId})`);
    this.emitPlayState();
    return planetId;
  }

  // 새 행성 생성 (addPlanet의 별칭)
  createPlanet(role: InstrumentRole, customId?: string, config?: PlanetSynthConfig): string {
    return this.addPlanet(role, customId, config);
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
    
    console.log(`🗑️ 행성 제거됨: ${planet.getName()}`);
    this.emitPlayState();
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

  updatePlanetSynthSettings(planetId: string, settings: PlanetSynthConfig): boolean {
    const planet = this.planets.get(planetId);
    if (!planet) {
      console.warn(`행성을 찾을 수 없습니다: ${planetId}`);
      return false;
    }

    planet.updateSynthSettings(settings);
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
    console.log('⏹️ 모든 행성 패턴 정지');
    this.emitPlayState();
  }

  // 다른 스텔라로 이동/새 생성 모드 진입 시 전체 오디오 상태 초기화 (부드러운 페이드아웃 포함) - 강화된 버전
  async resetForNewSystem(rampSeconds: number = 0.6): Promise<void> {
    console.log('🌌 StellarSystem 전체 리셋 시작...');
    
    // 1. 오디오 엔진 전환 상태로 설정
    this.audioEngine.beginTransition();
    
    // 2. 부드러운 페이드아웃 및 완전한 오디오 정지
    await this.audioEngine.fadeOutAndStop(rampSeconds);
    console.log('🌌 페이드아웃 완료');

    // 3. 모든 행성 패턴 정지 (각 행성에서 Star 클락 리스너 제거)
    this.stopAllPatterns();
    console.log('🌌 모든 패턴 정지됨');
    
    // 4. 모든 행성 완전히 dispose 및 정리
    const planetCount = this.planets.size;
    Array.from(this.planets.values()).forEach(planet => {
      try {
        // 먼저 패턴을 확실히 정지
        if (planet.getIsPlaying()) {
          planet.stopPattern();
        }
        // 그 다음 dispose (이중 안전장치)
        planet.dispose();
      } catch (error) {
        console.warn(`행성 ${planet.getName()} dispose 중 오류:`, error);
      }
    });
    this.planets.clear();
    console.log(`🌌 ${planetCount}개 행성 완전히 정리됨`);

    // 5. Tone.js Transport에서 남은 스케줄들 추가 정리
    try {
      // 혹시 남아있을 수 있는 모든 Tone.js Loop나 Part들을 정리
      Tone.Transport.cancel(0); // 다시 한 번 확실히
      
      // 약간의 대기 시간 후 다시 한 번 취소 (비동기 스케줄 대응)
      setTimeout(() => {
        try {
          Tone.Transport.cancel(0);
          console.log('🌌 지연된 스케줄 취소 완료');
        } catch (error) {
          console.warn('지연된 스케줄 취소 중 오류:', error);
        }
      }, 100); // 100ms 후 추가 정리
      
    } catch (error) {
      console.warn('추가 스케줄 정리 중 오류:', error);
    }

    // 5. 항성 클락 시스템 완전히 초기화 (리스너 제거 + 클락 재생성)
    this.star.clearAllClockListeners();
    console.log('🌌 항성 클락 시스템 초기화됨');

    // 6. 오디오 엔진 완전히 리셋 (Transport + 이펙트 체인 + 볼륨 복원)
    this.audioEngine.reset();
    console.log('🌌 오디오 엔진 리셋됨');
    
    // 7. 재생 상태 이벤트 전송 (UI 동기화)
    this.emitPlayState();
    
    // 8. 전환 상태 해제
    this.audioEngine.endTransition();
    
    console.log('🌌 StellarSystem 전체 리셋 완료');
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
