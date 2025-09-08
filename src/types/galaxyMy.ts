// 내 항성계 목록 데이터
export interface GalaxyMyListData {
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
