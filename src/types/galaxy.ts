export interface Galaxy {
  id: string;
  createdAt: string;
  updatedAt: string;
  allStellarList: simpleStellar[];
}

export interface simpleStellar {
  id: string;
  title: string;
  position: [number, number, number];
  color: number; //star color
}

export interface ParamsGetAllStellarList {
  id: string;
}

// Galaxy 화면에서 사용할 확장된 타입들
export interface GalaxyViewData {
  galaxy: Galaxy | null;
  stellarSystems: simpleStellar[];
  isLoading: boolean;
  error: string | null;
}

export interface GalaxyViewProps {
  galaxyId: string;
  onStellarSelect?: (stellarId: string) => void;
  onStellarDeselect?: () => void;
}
