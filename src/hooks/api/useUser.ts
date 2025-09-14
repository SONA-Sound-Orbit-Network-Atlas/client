import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userAPI,
  type UpdateProfileRequest,
  type UpdateProfileResponse,
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
