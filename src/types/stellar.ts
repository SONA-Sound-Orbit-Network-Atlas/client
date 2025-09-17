// SONA 스텔라 시스템 타입 정의
// 항성(Star) + 행성(Planet) 구조

import type {
  InstrumentRole,
  PlanetProperties,
  PropertyDefinition,
  UIProperty,
} from './planetProperties';
import type { StarProperties } from './starProperties';

// 백엔드 호환을 위한 재내보내기
export type {
  PlanetProperties,
  PropertyDefinition,
  UIProperty,
  InstrumentRole,
};

// === 새로운 스텔라 시스템 구조 (백엔드 호환) ===

export interface StellarSystem {
  id: string;
  title: string; // 스텔라(항성계) 이름
  galaxy_id: string; // 소속 갤럭시 ID 추가

  // 원작자 추적 정보 (새로운 필드명 사용)
  creator_id: string; // 현재 소유자
  author_id: string; // 최초 생성자 (원작자)
  create_source_id?: string; // 클론한 스텔라 (클론인 경우)
  original_source_id?: string; // 최초 스텔라 (클론 체인의 첫 번째)
  created_via?: 'MANUAL' | 'CLONE'; // 생성 방식

  created_at: string;
  updated_at?: string;

  // 1:1 관계 - 전역 제어용 항성
  star: Star;

  // 1:N 관계 - 개별 악기들
  planets: Planet[];

  // 위치
  position: [number, number, number];
}

export type ObjectType = 'STAR' | 'PLANET';

// 항성 (전역 오디오 제어)
export interface Star {
  id: string;
  object_type: 'STAR';
  system_id: string; // StellarSystem과 1:1 관계
  name: string; // 항성 이름
  properties: StarProperties; // 전역 BPM, Volume, Key/Scale 등
  created_at?: string;
  updated_at?: string;
}

// 행성 (개별 악기)
export interface Planet {
  id: string;
  object_type: 'PLANET';
  system_id: string;
  name: string; // 행성 이름
  role: InstrumentRole; // 악기 역할
  properties: PlanetProperties; // 개별 악기 속성
  created_at?: string;
  updated_at?: string;
}

// === 생성/수정 DTO 타입 ===

export interface CreateStellarSystemDto {
  title: string;
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
  title?: string;
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

// === (Stellar 생성 API) Payload 타입 ===
export type CreateStellarPayload = {
  title: string;
  galaxy_id: string;
  star: {
    spin: number;
    brightness: number;
    color: number;
    size: number;
  };
  planets: Array<{
    name: string;
    role: InstrumentRole;
    properties: {
      size: number;
      color: number;
      brightness: number;
      distance: number;
      speed: number;
      tilt: number;
      spin: number;
      eccentricity: number;
      elevation: number;
      phase: number;
    };
  }>;
};
