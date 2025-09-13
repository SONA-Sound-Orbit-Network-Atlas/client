// SYSTEM 데이터
export type ObjectType = 'CENTRAL STAR' | 'PLANET';
export type SoundType = 'LEAD' | 'BASS' | 'ARP' | 'PAD' | 'DRUM';

export interface Property {
  label: string; // 표시 라벨 ex) '게이지 1'
  value: number; // 현재 값
  min: number;
  max: number;
  unit: number; // 선택: '°' 등
}

interface BaseObject {
  name: string; // ex) 'CENTRAL STAR', 'BASS PLANET'
  planetType: ObjectType;
  planetId: number;
  status?: string; // 'ACTIVE' 등
}

export interface CentralStar extends BaseObject {
  planetType: 'CENTRAL STAR';
  bpm?: number;
  creator?: string;
  author?: string;
  createSource?: string;
  originalSource?: string;
  properties: Property[];
}

export interface Planet extends BaseObject {
  planetType: 'PLANET';
  soundType: SoundType;
  lastEdited?: string;
  created?: string;
  properties: Property[];
}

export type Object = CentralStar | Planet;

export interface StellarType {
  userId: string;
  stellarId: string;
  stellarName?: string;
  updatedAt?: string;
  creator?: string;
  author?: string;
  objects: Object[]; // 중앙별 1 + 행성 N
}
