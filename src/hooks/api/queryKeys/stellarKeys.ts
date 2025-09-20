// useStellar.ts의 쿼리키 모음
export const stellarKeys = {
  all: ['stellar'] as const,
  detail: (stellarId: string) => [...stellarKeys.all, stellarId] as const,

  // 리스트 관련
  lists: () => [...stellarKeys.all, 'list'] as const,
} as const;
