/**
  @property planetSize 행성의 크기, 0.01 ~ 1.00 범위 최적
  @property planetColor 행성의 색상
  @property planetBrightness 행성의 밝기, 0.3 ~ 5.0 ? 자체발광? 이럼 항성인데?
  @property distanceFromStar 1.0 ~ 20.0 범위 최적 행성과 항성계의 거리,  // 동일 거리 허용할건가?
  @property orbitSpeed  0.01~1.0 행성의 공전 속도
  @property rotationSpeed 0.01~1.0 행성의 자전 속도
  @property inclination -180 ~ 180 행성의 기울기
  @property eccentricity 0.0 ~ 0.9 행성의 이심률
  @property tilt 0.0 ~ 180.0 행성의 기울기
 */

export type TPlanet = {
  planetSize: number; // 0.1
  planetColor: number;
  planetBrightness: number;
  distanceFromStar: number;
  orbitSpeed: number;
  rotationSpeed: number;
  inclination: number;
  eccentricity: number;
  tilt: number;
};

export type TStellarSystemOnGalaxy = {
  id: number;
  name: string;
  starColor: string;
  stellarSystemPos: [number, number, number];
};

export type TStellarSystem = {
  id: number;
  name: string;
  planets: TPlanet[];
  stellarSystemPos: [number, number, number];
};
