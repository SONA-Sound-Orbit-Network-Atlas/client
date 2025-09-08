// STAR 정보
export interface STAR {
  name: string;
  type: 'CENTRAL STAR';
  status?: string;
  bpm?: number;
  creator?: string;
  author?: string;
  create_source?: string;
  original_source?: string;
}

// STAR 를 제외한 다른 PLANET 정보
export interface PLANET {
  name: string;
  type: 'PLANET';
  status?: string;
  sound_type?: string;
  last_edited?: string;
  created?: string;
}
