// useUser.ts의 쿼리키 모음
export const userKeys = {
  all: ['user'] as const,
  currentUserProfile: () => ['currentUserProfile'] as const,
  userProfile: (userId: string) => ['userProfile', userId] as const,
} as const;
