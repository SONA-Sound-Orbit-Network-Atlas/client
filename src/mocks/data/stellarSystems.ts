import type { StellarSystem, Star, Planet } from '@/types/stellar';
import type { StarProperties } from '@/types/starProperties';
import type { PlanetProperties } from '@/types/planetProperties';

// 목 데이터용 기본 항성 속성
const createMockStarProperties = (
  overrides: Partial<StarProperties> = {}
): StarProperties => ({
  spin: 50,
  brightness: 75,
  color: 60,
  size: 60,
  ...overrides,
});

// 목 데이터용 기본 행성 속성
const createMockPlanetProperties = (
  overrides: Partial<PlanetProperties> = {}
): PlanetProperties => ({
  planetSize: 0.5,
  planetColor: 180,
  planetBrightness: 2.65,
  distanceFromStar: 10.5,
  orbitSpeed: 0.5,
  rotationSpeed: 0.5,
  inclination: 0,
  eccentricity: 0.45,
  tilt: 90,
  ...overrides,
});

// 목 데이터용 행성들 생성
const createMockPlanets = (systemId: string): Planet[] => [
  {
    id: `${systemId}-planet-1`,
    object_type: 'PLANET',
    system_id: systemId,
    name: 'Bass Planet',
    role: 'BASS',
    properties: createMockPlanetProperties({
      planetSize: 0.6,
      planetColor: 72,
      planetBrightness: 2.8,
      distanceFromStar: 8.5,
      orbitSpeed: 0.4,
      rotationSpeed: 0.4,
      inclination: -35,
      eccentricity: 0.5,
    }),
    created_at: '2021-01-02T00:00:00Z',
    updated_at: '2021-01-02T00:00:00Z',
  },
  {
    id: `${systemId}-planet-2`,
    object_type: 'PLANET',
    system_id: systemId,
    name: 'Arpeggio Planet',
    role: 'ARPEGGIO',
    properties: createMockPlanetProperties({
      planetSize: 0.6,
      planetColor: 144,
      planetBrightness: 1.5,
      distanceFromStar: 8,
      orbitSpeed: 0.2,
      rotationSpeed: 0.2,
      inclination: -35,
      eccentricity: 0.5,
    }),
    created_at: '2021-01-03T00:00:00Z',
    updated_at: '2021-01-03T00:00:00Z',
  },
  {
    id: `${systemId}-planet-3`,
    object_type: 'PLANET',
    system_id: systemId,
    name: 'Pad Planet',
    role: 'PAD',
    properties: createMockPlanetProperties({
      planetSize: 0.8,
      planetColor: 216,
      planetBrightness: 3.2,
      distanceFromStar: 10,
      orbitSpeed: 0.1,
      rotationSpeed: 0.1,
      inclination: 15,
      eccentricity: 0.1,
    }),
    created_at: '2021-01-04T00:00:00Z',
    updated_at: '2021-01-04T00:00:00Z',
  },
  {
    id: `${systemId}-planet-4`,
    object_type: 'PLANET',
    system_id: systemId,
    name: 'Drum Planet',
    role: 'DRUM',
    properties: createMockPlanetProperties({
      planetSize: 1.0,
      planetColor: 288,
      planetBrightness: 0.8,
      distanceFromStar: 12,
      orbitSpeed: 0.05,
      rotationSpeed: 0.05,
      inclination: 0,
      eccentricity: 0.05,
    }),
    created_at: '2021-01-05T00:00:00Z',
    updated_at: '2021-01-05T00:00:00Z',
  },
];

// 목 데이터용 항성들 생성
const createMockStars = (systemId: string): Star => ({
  id: `${systemId}-star`,
  object_type: 'STAR',
  system_id: systemId,
  name: 'Central Star',
  properties: createMockStarProperties({
    spin: 60, // BPM 120
    brightness: 80,
    color: 120,
    size: 60,
  }),
  created_at: '2021-01-01T00:00:00Z',
  updated_at: '2021-01-01T00:00:00Z',
});

// 새로운 StellarSystem 타입에 맞는 목 데이터
const stellarSystemsMock: StellarSystem[] = [
  {
    id: 'sys-001',
    title: 'Stellar System 1',
    galaxy_id: 'galaxy-001',
    owner_id: 'testUser',
    created_by_id: 'testUser',
    original_author_id: 'testUser',
    created_via: 'MANUAL',
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2021-01-01T00:00:00Z',
    star: createMockStars('sys-001'),
    planets: createMockPlanets('sys-001'),
    position: [0, 0, 0],
  },
  {
    id: 'sys-002',
    title: 'Stellar System 2',
    galaxy_id: 'galaxy-001',
    owner_id: 'testUser',
    created_by_id: 'testUser',
    original_author_id: 'testUser',
    created_via: 'MANUAL',
    created_at: '2021-01-02T00:00:00Z',
    updated_at: '2021-01-02T00:00:00Z',
    star: createMockStars('sys-002'),
    planets: createMockPlanets('sys-002'),
    position: [20, 0, 0],
  },
  {
    id: 'sys-003',
    title: 'Stellar System 3',
    galaxy_id: 'galaxy-001',
    owner_id: 'testUser',
    created_by_id: 'testUser',
    original_author_id: 'testUser',
    created_via: 'MANUAL',
    created_at: '2021-01-03T00:00:00Z',
    updated_at: '2021-01-03T00:00:00Z',
    star: createMockStars('sys-003'),
    planets: createMockPlanets('sys-003'),
    position: [30, 0, 0],
  },
  {
    id: 'sys-004',
    title: 'Stellar System 4',
    galaxy_id: 'galaxy-001',
    owner_id: 'testUser',
    created_by_id: 'testUser',
    original_author_id: 'testUser',
    created_via: 'MANUAL',
    created_at: '2021-01-04T00:00:00Z',
    updated_at: '2021-01-04T00:00:00Z',
    star: createMockStars('sys-004'),
    planets: createMockPlanets('sys-004'),
    position: [0, -20, 30],
  },
  {
    id: 'sys-005',
    title: 'Stellar System 5',
    galaxy_id: 'galaxy-001',
    owner_id: 'testUser',
    created_by_id: 'testUser',
    original_author_id: 'testUser',
    created_via: 'MANUAL',
    created_at: '2021-01-05T00:00:00Z',
    updated_at: '2021-01-05T00:00:00Z',
    star: createMockStars('sys-005'),
    planets: createMockPlanets('sys-005'),
    position: [0, -20, 10],
  },
  {
    id: 'sys-006',
    title: 'Stellar System 6',
    galaxy_id: 'galaxy-001',
    owner_id: 'testUser',
    created_by_id: 'testUser',
    original_author_id: 'testUser',
    created_via: 'MANUAL',
    created_at: '2021-01-06T00:00:00Z',
    updated_at: '2021-01-06T00:00:00Z',
    star: createMockStars('sys-006'),
    planets: createMockPlanets('sys-006'),
    position: [0, 0, 400],
  },
  {
    id: 'sys-007',
    title: 'Stellar System 7',
    galaxy_id: 'galaxy-001',
    owner_id: 'testUser',
    created_by_id: 'testUser',
    original_author_id: 'testUser',
    created_via: 'MANUAL',
    created_at: '2021-01-07T00:00:00Z',
    updated_at: '2021-01-07T00:00:00Z',
    star: createMockStars('sys-007'),
    planets: createMockPlanets('sys-007'),
    position: [0, 0, -2000],
  },
];

export const getStellarSystemMock = (
  stellarId: string
): StellarSystem | undefined => {
  return stellarSystemsMock.find((stellar) => stellar.id === stellarId);
};

export const getAllStellarSystemsMock = (): StellarSystem[] => {
  return stellarSystemsMock;
};

export const getStellarSystemsByGalaxyMock = (
  galaxyId: string
): StellarSystem[] => {
  return stellarSystemsMock.filter((stellar) => stellar.galaxy_id === galaxyId);
};

export const getStellarSystemsByUserMock = (
  userId: string
): StellarSystem[] => {
  return stellarSystemsMock.filter((stellar) => stellar.owner_id === userId);
};
