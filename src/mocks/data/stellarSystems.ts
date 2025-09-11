import type {
  TPlanet,
  TStellarSystem,
  TStellarSystemOnGalaxy,
} from '@/types/cosmos';

const mockPlanets: TPlanet[] = [
  {
    distanceFromStar: 3,
    orbitSpeed: 0.3,
    planetSize: 0.4,
    planetColor: '#FFFFFF',
    rotationSpeed: 0.3,
    inclination: -180,
    planetBrightness: 1,
    eccentricity: 0.5,
    tilt: 0,
  },
  {
    distanceFromStar: 8.5,
    orbitSpeed: 0.4,
    planetSize: 0.6,
    planetColor: '#96ceb4',
    rotationSpeed: 0.4,
    inclination: 120,
    planetBrightness: 1,
    eccentricity: 0.1,
    tilt: 0,
  },
  {
    distanceFromStar: 8,
    orbitSpeed: 0.2,
    planetSize: 0.6,
    planetColor: '#feca57',
    rotationSpeed: 0.2,
    inclination: -35,
    planetBrightness: 1,
    eccentricity: 0.5,
    tilt: 0,
  },
  {
    distanceFromStar: 10,
    orbitSpeed: 0.1,
    planetSize: 0.8,
    planetColor: '#ff9ff3',
    rotationSpeed: 0.1,
    inclination: 15,
    planetBrightness: 0.1,
    eccentricity: 0.1,
    tilt: 0,
  },
];
export const stellarSystemsMock: TStellarSystemOnGalaxy[] = [
  {
    id: 1,
    name: 'Stellar System 1',
    starColor: '#FFFFFF',
    stellarSystemPos: [0, 0, 0],
  },
  {
    id: 2,
    name: 'Stellar System 2',
    starColor: '#FFFFFF',
    stellarSystemPos: [20, 0, 0],
  },
  {
    id: 3,
    name: 'Stellar System 3',
    starColor: '#FFFFFF',
    stellarSystemPos: [-30, 0, 0],
  },
  {
    id: 4,
    name: 'Stellar System 4',
    starColor: '#FFFFFF',
    stellarSystemPos: [0, 1, 30],
  },
  {
    id: 5,
    name: 'Stellar System 5',
    starColor: '#FFFFFF',
    stellarSystemPos: [0, -2, 10],
  },
  {
    id: 6,
    name: 'Stellar System 6',
    starColor: '#FFFFFF',
    stellarSystemPos: [0, 0, 120],
  },
  {
    id: 7,
    name: 'Stellar System 7',
    starColor: '#FFFFFF',
    stellarSystemPos: [0, 0, -130],
  },
];

export const detailStellarSystemsMock: Record<number, TStellarSystem> = {
  1: {
    id: 1,
    name: 'Stellar System 1',
    planets: mockPlanets,
    stellarSystemPos: [0, 0, 0],
  },
  2: {
    id: 2,
    name: 'Stellar System 2',
    planets: mockPlanets,
    stellarSystemPos: [20, 0, 0],
  },
  3: {
    id: 3,
    name: 'Stellar System 3',
    planets: mockPlanets,
    stellarSystemPos: [-30, 0, 0],
  },
  4: {
    id: 4,
    name: 'Stellar System 4',
    planets: mockPlanets,
    stellarSystemPos: [0, 1, 30],
  },
  5: {
    id: 5,
    name: 'Stellar System 5',
    planets: mockPlanets,
    stellarSystemPos: [0, -2, 10],
  },
  6: {
    id: 6,
    name: 'Stellar System 6',
    planets: mockPlanets,
    stellarSystemPos: [0, 0, 120],
  },
  7: {
    id: 7,
    name: 'Stellar System 7',
    planets: mockPlanets,
    stellarSystemPos: [0, 0, -130],
  },
};
