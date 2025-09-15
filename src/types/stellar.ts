// SONA 스텔라 시스템 타입 정의
// 항성(Star) + 행성(Planet) 구조

import type { InstrumentRole, PlanetProperties, PropertyDefinition, UIProperty } from './planetProperties';
import type { StarProperties } from './starProperties';

// 백엔드 호환을 위한 재내보내기
export type { PlanetProperties, PropertyDefinition, UIProperty, InstrumentRole };

// === 새로운 스텔라 시스템 구조 (백엔드 호환) ===

export interface StellarSystem {
  id: string;
  name: string;

  // 원작자 추적 정보 (백엔드 스키마 호환)
  owner_id?: string;           // 현재 소유자
  created_by_id?: string;      // 최초 생성자
  original_author_id?: string; // 원작자 (클론 시 승계)
  source_system_id?: string;   // 원본 시스템 ID (클론인 경우)
  created_via?: 'MANUAL' | 'CLONE'; // 생성 방식

  created_at?: string;
  updated_at?: string;

  // 1:1 관계 - 전역 제어용 항성
  star?: Star;

  // 1:N 관계 - 개별 악기들
  planets: Planet[];
}

// 항성 (전역 오디오 제어)
export interface Star {
  id: string;
  system_id: string; // StellarSystem과 1:1 관계
  properties: StarProperties; // 전역 BPM, Volume, Key/Scale 등
  created_at?: string;
  updated_at?: string;
}

// 행성 (개별 악기)
export interface Planet {
  id: string;
  system_id: string;
  name: string;
  role: InstrumentRole; // 악기 역할
  properties: PlanetProperties; // 개별 악기 속성
  created_at?: string;
  updated_at?: string;
}

// === 생성/수정 DTO 타입 ===

export interface CreateStellarSystemDto {
  name: string;
  description?: string;
}

export interface CreateStarDto {
  system_id: string;
  properties: StarProperties;
}

export interface CreatePlanetDto {
  system_id: string;
  name: string;
  role: InstrumentRole;
  properties: PlanetProperties;
}

export interface UpdateStellarSystemDto {
  name?: string;
  description?: string;
}

export interface UpdateStarDto {
  properties?: Partial<StarProperties>;
}

export interface UpdatePlanetDto {
  name?: string;
  role?: InstrumentRole;
  properties?: Partial<PlanetProperties>;
}

// === 응답 타입 ===

export interface StellarSystemResponse {
  success: boolean;
  data?: StellarSystem;
  message?: string;
}

export interface StellarSystemListResponse {
  success: boolean;
  data?: StellarSystem[];
  message?: string;
}

export interface StarResponse {
  success: boolean;
  data?: Star;
  message?: string;
}

export interface PlanetResponse {
  success: boolean;
  data?: Planet;
  message?: string;
}

export interface PlanetListResponse {
  success: boolean;
  data?: Planet[];
  message?: string;
}

// === 레거시 타입들 (하위 호환성 유지) ===

export type PlanetType = 'CENTRAL_STAR' | 'PLANET';

// 레거시 Property 인터페이스 (하위 호환성 유지)
export interface Property {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: number;
}

interface BasePlanet {
  name: string;
  planet_type: PlanetType;
  planetId?: number;
  status?: string;
}

export interface CentralStar extends BasePlanet {
  planet_type: 'CENTRAL_STAR';
  bpm?: number;
  creator?: string;
  author?: string;
  createSource?: string;
  originalSource?: string;
  properties: PlanetProperties; // 통합 타입 사용
}

export interface LegacyPlanet extends BasePlanet {
  planet_type: 'PLANET';
  instrument_role?: InstrumentRole;
  lastEdited?: string;
  created?: string;
  properties: PlanetProperties; // 통합 타입 사용
}

export type PlanetObject = CentralStar | LegacyPlanet;

export interface StellarType {
  userId: string;
  stellarId: string;
  position?: [number, number, number];
  stellarName?: string;
  updatedAt?: string;
  creator?: string;
  author?: string;
  planets: PlanetObject[];
}
