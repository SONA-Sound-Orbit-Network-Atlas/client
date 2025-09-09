import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginData, SignupData } from '@/types/auth';
import { authAPI } from '@/api/auth';
import type { User } from '@/types/user';

// 회원가입
export function useSignup(data: SignupData) {
  return useMutation({
    mutationKey: ['auth', 'signup'],
    mutationFn: () => authAPI.signup(data),
  });
}

// 로그인
export function useLogin(data: LoginData) {
  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: () => authAPI.login(data),
  });
}

// 로그아웃
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authAPI.logout(),
    onSuccess: async () => {
      queryClient.setQueryData(['session'], null); // 즉시 비로그인으로 반영
      await queryClient.invalidateQueries({ queryKey: ['galaxyMyList'] });
    },
  });
}

// 로그인 유지 확인
export function useGetSession() {
  return useQuery<User | null>({
    queryKey: ['session'],
    queryFn: () => authAPI.getSession(),
    staleTime: 0,
    retry: false,
  });
}
