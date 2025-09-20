// useGalaxy.ts의 쿼리키 모음
export const galaxyKeys = {
  // 전체 무효화용 (prefix matching 사용)
  all: ['stellarList'] as const, // 'stellarList'*로 시작하는 모든 쿼리 무효화

  // COMMUNITY 리스트 (기존 쿼리키 구조 유지)
  stellarListCommunity: (params: { limit: number; rank_type?: string }) =>
    [...galaxyKeys.all, 'community', params.limit, params.rank_type] as const,

  // MY 리스트 (기존 쿼리키 구조 유지)
  stellarListMy: (params: { limit: number }) =>
    [...galaxyKeys.all, 'my', params.limit] as const,

  // 전체 스텔라 리스트 조회 (기존 쿼리키 구조 유지)
  stellarListAll: (galaxyId: string) =>
    [...galaxyKeys.all, 'all', galaxyId] as const,
} as const;
