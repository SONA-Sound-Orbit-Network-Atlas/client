import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userAPI,
  type UpdateProfileRequest,
  type UpdateProfileResponse,
  type UpdatePasswordRequest,
  type DeactivateAccountRequest,
} from '@/api/user';
import type { User } from '@/types/user';
import { useUserStore } from '@/stores/useUserStore';
import type { AxiosError } from 'axios';

// 사용자 프로필 조회
export function useGetUserProfile(userId: string) {
  return useQuery<User>({
    queryKey: ['userProfile', userId],
    queryFn: () => userAPI.getUserProfile(userId),
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
}

// 사용자 프로필 수정
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { setUserStore } = useUserStore();

  return useMutation<UpdateProfileResponse, AxiosError, UpdateProfileRequest>({
    mutationFn: (data: UpdateProfileRequest) => userAPI.updateUserProfile(data),
    onSuccess: (response: UpdateProfileResponse) => {
      // 응답에서 실제 사용자 데이터 추출
      const updatedUser = response.user;

      console.log('✅ 프로필이 수정되었습니다!', {
        username: updatedUser.username,
        about: updatedUser.about,
        email: updatedUser.email,
        updated_at: updatedUser.updated_at,
      });

      setUserStore(updatedUser);

      // 캐시 업데이트 (서버에서 받은 최신 데이터로)
      queryClient.setQueryData(['userProfile', updatedUser.id], updatedUser);

      // 모든 userProfile 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['userProfile'],
      });
    },
    onError: (error: AxiosError) => {
      console.error('프로필 수정 실패:', error);
    },
  });
}

// 사용자 비밀번호 변경
export function useUpdatePassword() {
  const queryClient = useQueryClient();
  const { setUserStore, userStore } = useUserStore();

  return useMutation<any, AxiosError, UpdatePasswordRequest>({
    mutationFn: (data: UpdatePasswordRequest) => userAPI.updatePassword(data),
    onSuccess: async () => {
      console.log('✅ 비밀번호가 변경되었습니다!');

      // 비밀번호 변경 API는 사용자 데이터를 반환하지 않으므로, 프로필 조회 API를 호출
      try {
        const updatedUser = await userAPI.getUserProfile(userStore.id);

        console.log('📋 업데이트된 사용자 데이터:', {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          updated_at: updatedUser.updated_at,
        });

        // 사용자 스토어 업데이트
        setUserStore(updatedUser);

        // 캐시 업데이트 (서버에서 받은 최신 데이터로)
        queryClient.setQueryData(['userProfile', updatedUser.id], updatedUser);
      } catch (error) {
        console.error('프로필 재조회 실패:', error);
      }
    },
    onError: (error: AxiosError) => {
      console.error('비밀번호 변경 실패:', error);
    },
  });
}

// 회원탈퇴
export function useDeactivateAccount() {
  const queryClient = useQueryClient();
  const { clearUserStore } = useUserStore();

  return useMutation<void, AxiosError, DeactivateAccountRequest>({
    mutationFn: (data: DeactivateAccountRequest) =>
      userAPI.deactivateAccount(data),
    onSuccess: () => {
      console.log('✅ 회원탈퇴가 완료되었습니다.');

      // 사용자 스토어 초기화 (로그아웃 처리)
      clearUserStore();

      // 모든 쿼리 캐시 무효화
      queryClient.clear();
    },
    onError: (error: AxiosError) => {
      console.error('회원탈퇴 실패:', error);
    },
  });
}
