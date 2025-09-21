// useLikes.ts의 쿼리키 모음
export const likesKeys = {
  all: ['likes'] as const,
  stellarList: () => ['stellarList'] as const,
  myLikes: (page?: number, limit?: number) => ['myLikes', page, limit] as const,
  myLikesInfinite: (limit?: number) => ['myLikesInfinite', limit] as const,
} as const;
