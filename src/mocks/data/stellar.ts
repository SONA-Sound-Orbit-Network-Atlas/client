// SONA 스텔라 시스템 Mock 데이터
// Star(항성) + Planet(행성) 분리 구조

import { createDefaultProperties } from '../../types/planetProperties';
import { createDefaultStarProperties } from '../../types/starProperties';
import type {
  StellarSystem,
  Star,
  Planet,
  StellarType,
} from '../../types/stellar';

// === 새로운 Star/Planet 분리 구조 ===

// 항성 모크 데이터
const mockStar: Star = {
  id: 'star_001',
  object_type: 'STAR',
  system_id: 'system_001',
  name: 'Central Star',
  properties: createDefaultStarProperties({
    spin: 65, // BPM ~= 138 (60 + 65*1.2 = 138)
    brightness: 80, // Master Tone Character (전체 음색 특성)
    color: 120, // Key/Scale 조합 (C# Major)
    size: 70, // Complexity Level 3 (70/33.33+1 = 3)
  }),
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// 행성들 모크 데이터 (각기 다른 악기 역할)
const mockPlanets: Planet[] = [
  {
    id: 'planet_001',
    object_type: 'PLANET',
    system_id: 'system_001',
    name: 'Rhythm Core',
    role: 'DRUM',
    properties: createDefaultProperties({
      planetSize: 0.3,
      planetColor: 0,
      planetBrightness: 3.5,
      distanceFromStar: 5.0,
      orbitSpeed: 0.8,
      rotationSpeed: 0.9,
      eccentricity: 0.2,
      tilt: 45,
    }),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'planet_002',
    object_type: 'PLANET',
    system_id: 'system_001',
    name: 'Bass Foundation',
    role: 'BASS',
    properties: createDefaultProperties({
      planetSize: 0.6,
      planetColor: 240,
      planetBrightness: 2.0,
      distanceFromStar: 8.0,
      orbitSpeed: 0.3,
      rotationSpeed: 0.2,
      eccentricity: 0.1,
      tilt: 10,
    }),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'planet_003',
    object_type: 'PLANET',
    system_id: 'system_001',
    name: 'Harmony Sphere',
    role: 'CHORD',
    properties: createDefaultProperties({
      planetSize: 0.7,
      planetColor: 60,
      planetBrightness: 2.8,
      distanceFromStar: 12.0,
      orbitSpeed: 0.4,
      rotationSpeed: 0.3,
      eccentricity: 0.3,
      tilt: 75,
    }),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'planet_004',
    object_type: 'PLANET',
    system_id: 'system_001',
    name: 'Melody Runner',
    role: 'MELODY',
    properties: createDefaultProperties({
      planetSize: 0.4,
      planetColor: 300,
      planetBrightness: 4.2,
      distanceFromStar: 15.0,
      orbitSpeed: 0.7,
      rotationSpeed: 0.8,
      eccentricity: 0.5,
      tilt: 120,
      melodicVariation: 75,
      patternComplexity: 60,
    }),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// 완전한 스텔라 시스템
export const mockStellarSystem: StellarSystem = {
  id: 'system_001',
  title: 'SONA Demo System',
  galaxy_id: 'galaxy_001', // galaxy_id 추가
  star: mockStar,
  planets: mockPlanets,
  // 원작자 추적 정보 (새로운 필드명 사용)
  creator_id: 'user_stann_001',         // 현재 소유자
  author_id: 'user_stann_001',          // 최초 생성자 (원본이므로 생성자와 동일)
  create_source_id: undefined,          // 클론한 스텔라 (원본이므로 undefined)
  original_source_id: undefined,        // 최초 스텔라 (원본이므로 undefined)
  created_via: 'MANUAL', // 수동 생성
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// === 레거시 호환성 유지 ===
// 기존 코드가 stellar을 사용하는 경우를 위한 호환성 보장

export const stellar: StellarType = {
  userId: 'testUser', // testUser하면 로그인으로 가정 , bob하면 비로그인으로 가정
  stellarId: 'sys-001',
  stellarName: 'CENTRAL STAR SYSTEM',
  updatedAt: '2021-01-03',
  planets: [
    {
      name: 'CENTRAL STAR',
      planet_type: 'CENTRAL_STAR',
      planetId: 0,
      status: 'ACTIVE',
      bpm: 120,
      creator: 'STANN',
      author: 'STANN',
      createSource: 'ORIGINAL COMPOSITION',
      originalSource: 'SONA STUDIO',
      properties: createDefaultProperties({
        planetSize: 0.8, // 항성은 더 크게
        planetBrightness: 4.5, // 항성은 더 밝게
        distanceFromStar: 0, // 항성은 중심에
      }),
    },
    {
      name: 'BASS PLANET',
      planet_type: 'PLANET',
      instrument_role: 'BASS',
      planetId: 1,
      status: 'ACTIVE',
      created: '2021-01-01',
      properties: createDefaultProperties({
        planetColor: 240, // 파란색 계열
        distanceFromStar: 8,
        filterResonance: 2.5, // 베이스는 낮은 주파수
        rhythmDensity: 70, // 베이스는 리듬감 중요
      }),
    },
    {
      name: 'MELODY PLANET',
      planet_type: 'PLANET',
      instrument_role: 'ARPEGGIO',
      planetId: 2,
      properties: createDefaultProperties({
        planetColor: 60, // 황색 계열
        distanceFromStar: 15,
        orbitSpeed: 0.8, // 더 빠른 궤도
        melodicVariation: 75, // 멜로디 변화 많이
        patternComplexity: 60, // 복잡한 아르페지오
      }),
    },
    // ... PERCUSSION / HARMONY / EFFECTS 등
  ],
};

// 개별 조회를 위한 함수들
export function getMockStellarSystem(id: string): StellarSystem | undefined {
  if (id === 'system_001') return mockStellarSystem;
  if (id === 'system_002') return mockClonedStellarSystem;
  return undefined;
}

export function getMockStar(systemId: string): Star | undefined {
  if (systemId === 'system_001') return mockStar;
  if (systemId === 'system_002') return mockClonedStellarSystem.star;
  return undefined;
}

export function getMockPlanets(systemId: string): Planet[] {
  if (systemId === 'system_001') return mockPlanets;
  if (systemId === 'system_002') return mockClonedStellarSystem.planets;
  return [];
}

export function getMockPlanet(planetId: string): Planet | undefined {
  const allPlanets = [
    ...mockPlanets,
    ...(mockClonedStellarSystem.planets || []),
  ];
  return allPlanets.find((p) => p.id === planetId);
}

// === 클론된 시스템 예시 (원작자 추적 데모용) ===

const mockClonedStar: Star = {
  id: 'star_002',
  object_type: 'STAR',
  system_id: 'system_002',
  name: 'Cloned Star', // name 필드 추가
  properties: createDefaultStarProperties({
    // 원본에서 약간 변형
    spin: 70, // 조금 더 빠르게
    brightness: 85, // 조금 더 밝게
    color: 150, // 다른 키로
    size: 75, // 조금 더 복잡하게
    // temperature: 80,
    // luminosity: 90,
    // radius: 65
  }),
  created_at: '2024-01-02T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};

const mockClonedPlanets: Planet[] = [
  {
    id: 'planet_005',
    object_type: 'PLANET',
    system_id: 'system_002',
    name: 'Enhanced Rhythm Core', // 이름 변경
    role: 'DRUM',
    properties: createDefaultProperties({
      planetSize: 0.35, // 조금 키움
      planetColor: 15, // 색상 변경
      planetBrightness: 3.8,
      distanceFromStar: 5.2,
      orbitSpeed: 0.85,
      rotationSpeed: 0.95,
      eccentricity: 0.25,
      tilt: 50,
    }),
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  // 나머지 행성들은 원본과 거의 동일하지만 ID와 system_id만 변경
  ...mockPlanets.slice(1).map((planet, index) => ({
    ...planet,
    id: `planet_${String(6 + index).padStart(3, '0')}`,
    system_id: 'system_002',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  })),
];

export const mockClonedStellarSystem: StellarSystem = {
  id: 'system_002',
  title: 'My Version of SONA Demo', // 사용자가 변경한 이름
  galaxy_id: 'galaxy_002', // galaxy_id 추가
  star: mockClonedStar,
  planets: mockClonedPlanets,
  // 클론 추적 정보 (새로운 필드명 사용)
  creator_id: 'user_alice_002',         // 현재 소유자 (클론한 사람)
  author_id: 'user_stann_001',          // 최초 생성자 (원작자)
  create_source_id: 'system_001',       // 클론한 스텔라 (원본 시스템 참조)
  original_source_id: 'system_001',     // 최초 스텔라 (이 경우 원본과 같음)
  created_via: 'CLONE', // 클론으로 생성
  created_at: '2024-01-02T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};
