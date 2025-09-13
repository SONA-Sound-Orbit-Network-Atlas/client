import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginData, SignupData } from '@/types/auth';
import { authAPI } from '@/api/auth';
import type { User } from '@/types/user';
import { useUserStore } from '@/stores/useUserStore';

// 회원가입
export function useSignup(data: SignupData) {
  return useMutation({
    mutationKey: ['auth', 'signup'],
    mutationFn: () => authAPI.signup(data),
  });
}

// 로그인
export function useLogin(data: LoginData) {
  const { setUserStore, setIsLoggedIn } = useUserStore();

  return useMutation({
    mutationKey: ['auth', 'login', data.email],
    mutationFn: () => authAPI.login(data),
    onSuccess: (data) => {
      const { userId, username } = data;
      setUserStore({ userId, username, email: data.email });
      setIsLoggedIn(true);
      console.log('로그인 성공 : ', data);
    },
  });
}

// 로그아웃
export function useLogout() {
  const queryClient = useQueryClient();
  const { setIsLoggedIn } = useUserStore();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authAPI.logout(),
    onSuccess: async () => {
      queryClient.setQueryData(['session'], null); // 즉시 비로그인으로 반영
      await queryClient.invalidateQueries({ queryKey: ['galaxyMyList'] });
      setIsLoggedIn(false);
      console.log('로그아웃 성공');
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
