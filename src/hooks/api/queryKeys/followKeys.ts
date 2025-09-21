// useFollow.ts의 쿼리키 모음
export const followKeys = {
  all: ['follow'] as const,
  followings: (userId: string) => ['followings', userId] as const,
  followers: (userId: string) => ['followers', userId] as const,
  followCount: (userId: string) => ['followCount', userId] as const,

  // 파라미터 포함 쿼리
  followersList: (targetId: string, page: number, limit: number) =>
    ['followers', targetId, page, limit] as const,
  followingsList: (targetId: string, page: number, limit: number) =>
    ['followings', targetId, page, limit] as const,
} as const;
