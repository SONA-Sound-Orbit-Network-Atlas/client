// useAuth.ts의 쿼리키 모음
export const authKeys = {
  all: ['auth'] as const,
  signup: () => [...authKeys.all, 'signup'] as const,
  login: (identifier: string) =>
    [...authKeys.all, 'login', identifier] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
  session: () => ['session'] as const,
} as const;
