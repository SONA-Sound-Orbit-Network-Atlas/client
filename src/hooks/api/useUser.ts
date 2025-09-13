import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/api/user';
import type { User } from '@/types/user';

// 사용자 프로필 조회
export function useGetUserProfile(userId: string) {
  return useQuery<User>({
    queryKey: ['userProfile', userId],
    queryFn: () => userAPI.getUserProfile(userId),
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
}
