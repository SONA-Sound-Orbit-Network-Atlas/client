// useFollow.ts의 쿼리키 모음
export const followKeys = {
  all: ['follow'] as const,
  followings: (userId: string) => ['followings', userId] as const,
  followers: (userId: string) => ['followers', userId] as const,
  followCount: (userId: string) => ['followCount', userId] as const,

  // 파라미터 포함 쿼리
  followersList: (userId: string, page: number, limit: number) =>
    ['followers', userId, page, limit] as const,
  followingsList: (userId: string, page: number, limit: number) =>
    ['followings', userId, page, limit] as const,
} as const;
