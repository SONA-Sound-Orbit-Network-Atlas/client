// SYSTEM 데이터
export type ObjectType = 'CENTRAL_STAR' | 'PLANET';
export type SoundType =
  | 'BASS'
  | 'MELODY'
  | 'PERCUSSION'
  | 'HARMONY'
  | 'EFFECTS';

export interface Property {
  key: string; // 내부 키 ex) 'gauge1', 'orbitAngle'
  label: string; // 표시 라벨 ex) '게이지 1'
  value: number; // 현재 값
  min: number;
  max: number;
  unit?: string; // 선택: '°' 등
}

interface BaseObject {
  id: string;
  name: string; // ex) 'CENTRAL STAR', 'BASS PLANET'
  type: ObjectType;
  status?: string; // 'ACTIVE' 등
}

export interface CentralStar extends BaseObject {
  type: 'CENTRAL_STAR';
  bpm?: number;
  creator?: string;
  author?: string;
  createSource?: string;
  originalSource?: string;
  properties: Property[];
}

export interface Planet extends BaseObject {
  type: 'PLANET';
  soundType: SoundType;
  lastEdited?: string;
  created?: string;
  properties: Property[];
}

export type Object = CentralStar | Planet;

export interface StellarType {
  stellarId: string;
  stellarName?: string;
  updatedAt?: string;
  objects: Object[]; // 중앙별 1 + 행성 N
}
