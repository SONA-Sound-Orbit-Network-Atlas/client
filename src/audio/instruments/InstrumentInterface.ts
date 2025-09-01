// Instrument 공통 인터페이스
// 모든 악기가 구현해야 하는 기본 메서드들을 정의합니다.

import * as Tone from 'tone';
import type { InstrumentRole, PlanetPhysicalProperties } from '../../types/audio';

export interface Instrument {
  // 기본 정보
  getId(): string;
  getRole(): InstrumentRole;
  
  // 노트 트리거 (모든 악기의 핵심 기능)
  triggerAttackRelease(
    notes: string | string[], 
    duration: string | number, 
    time?: Tone.Unit.Time, 
    velocity?: number
  ): void;
  
  // 행성 속성 업데이트 (SONA의 핵심 기능)
  updateFromPlanet(props: PlanetPhysicalProperties): void;
  
  // 리소스 정리
  dispose(): void;
  
  // 폐기 상태 확인
  isDisposed(): boolean;
}
