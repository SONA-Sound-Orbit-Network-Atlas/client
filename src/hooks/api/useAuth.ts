import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
    onSuccess: (response) => {
      const { access_token, user } = response;

      // access_token을 localStorage에 저장
      localStorage.setItem('accessToken', access_token);

      // 사용자 정보를 스토어에 저장
      setUserStore({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      setIsLoggedIn(true);

      // 사용자 정보를 localStorage에도 저장 (새로고침 시 복원용)
      localStorage.setItem('userInfo', JSON.stringify(user));
    },
    onError: (error: AxiosError) => {
      console.error('로그인 실패:', error);

      // API 에러 응답 처리
      if (
        error.response?.data &&
        typeof error.response.data === 'object' &&
        'error' in error.response.data
      ) {
        const apiError = (error.response.data as any).error;
        console.error('API 에러:', apiError.message);
      }
    },
  });
}

// 로그아웃
export function useLogout() {
  const queryClient = useQueryClient();
  const { setIsLoggedIn, clearUserStore } = useUserStore();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authAPI.logout(),
    onSuccess: async () => {
      // localStorage에서 accessToken과 userInfo 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');

      queryClient.setQueryData(['session'], null); // 즉시 비로그인으로 반영
      await queryClient.invalidateQueries({ queryKey: ['galaxyMyList'] });
      setIsLoggedIn(false);
    },
    onError: async (error: AxiosError) => {
      console.warn('로그아웃 API 호출 실패:', error);

      // 서버 응답과 관계없이 로컬 상태 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      clearUserStore(); // 사용자 스토어 완전 초기화
      queryClient.setQueryData(['session'], null);
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
