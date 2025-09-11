// Galaxy My 데이터
export interface GalaxyMyData {
  totalCount: number;
  list: GalaxyMyListData[];
}

// 내 항성계 목록 데이터
export interface GalaxyMyListData {
  id: string;
  galaxyName: string;
  updatedAt: string;
  planetCount: number;
  favoriteCount: number;
}

// 내 항성계 목록 조회 파라미터
export interface ParamsGetGalaxyMyList {
  page: number;
  limit: number;
}
