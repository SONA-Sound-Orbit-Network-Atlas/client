import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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

// 현재 사용자 프로필 조회 (userStore 업데이트 포함)
export function useGetCurrentUserProfile() {
  const { setUserStore, userStore } = useUserStore();

  const query = useQuery<User>({
    queryKey: ['currentUserProfile'],
    queryFn: () => userAPI.getUserProfile(userStore.id),
    enabled: !!userStore.id,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 프로필 조회 성공 시 자동으로 스토어 업데이트
  useEffect(() => {
    if (query.data) {
      setUserStore(query.data);
    }
  }, [query.data, setUserStore]);

  return query;
}

// 다른 사용자 프로필 조회 (userStore 업데이트 없음)
export function useGetUserProfile(userId: string) {
  const query = useQuery<User>({
    queryKey: ['userProfile', userId],
    queryFn: () => userAPI.getUserProfile(userId),
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  return query;
}

// 사용자 프로필 수정
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

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
  const { userStore } = useUserStore();

  return useMutation<void, AxiosError, UpdatePasswordRequest>({
    mutationFn: (data: UpdatePasswordRequest) => userAPI.updatePassword(data),
    onSuccess: () => {
      console.log('✅ 비밀번호가 변경되었습니다!');

      // 비밀번호 변경 성공 시 userProfile 쿼리를 무효화하여 자동 리페치 유도
      queryClient.invalidateQueries({
        queryKey: ['userProfile', userStore.id],
      });
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
