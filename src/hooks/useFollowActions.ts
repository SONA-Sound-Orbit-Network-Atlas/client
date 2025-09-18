import { useState, useCallback } from 'react';
import { useCreateFollow, useDeleteFollow } from '@/hooks/api/useFollow';

// 팔로우 액션 상태 관리 훅
export function useFollowActions() {
  const createFollowMutation = useCreateFollow();
  const deleteFollowMutation = useDeleteFollow();

  // 팔로우 상태를 위한 로컬 상태 관리 (팔로잉 패널용)
  const [unfollowedUsers, setUnfollowedUsers] = useState<Set<string>>(
    new Set()
  );

  // 팔로우 핸들러
  const handleFollow = (userId: string) => {
    createFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 언팔로우 상태에서 제거
          setUnfollowedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        },
        onError: (error) => {
          console.error('팔로우 실패:', error);
          // TODO: 토스트 메시지로 사용자에게 에러 알림
        },
      }
    );
  };

  // 언팔로우 핸들러
  const handleUnfollow = (userId: string) => {
    deleteFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 언팔로우한 사용자를 로컬 상태에 추가
          setUnfollowedUsers((prev) => new Set(prev).add(userId));
        },
        onError: (error) => {
          console.error('언팔로우 실패:', error);
          // TODO: 토스트 메시지로 사용자에게 에러 알림
        },
      }
    );
  };

  // 맞팔로우 상태 확인 (팔로워 패널용)
  // API에서 받은 isMutual 값이 true이면 맞팔로우
  const isMutualFollow = (isMutualFromAPI: boolean) => {
    return isMutualFromAPI;
  };

  // 팔로우백 상태 확인 (팔로워 패널용)
  // 상대방이 나를 팔로우하고 있지만 내가 팔로우하지 않은 경우
  // API에서 isMutual이 false이면 팔로우백 가능
  const isFollowBack = (isMutualFromAPI: boolean) => {
    return !isMutualFromAPI;
  };

  // 팔로잉 상태 확인 (팔로잉 패널용)
  // 팔로잉 패널에서는 기본적으로 모든 사용자가 팔로우 상태
  // 단, 언팔로우한 사용자는 제외
  const isStillFollowing = (userId: string) => {
    return !unfollowedUsers.has(userId);
  };

  // 맞팔로우 상태 확인 (팔로잉 패널용)
  // API에서 받은 isMutual 값이 true이고, 언팔로우하지 않은 경우
  const isStillMutualFollow = (userId: string, isMutualFromAPI: boolean) => {
    return isMutualFromAPI && !unfollowedUsers.has(userId);
  };

  // 상태 초기화 (메모이제이션)
  const resetStates = useCallback(() => {
    setUnfollowedUsers(new Set());
  }, []);

  return {
    handleFollow,
    handleUnfollow,
    isMutualFollow,
    isFollowBack,
    isStillFollowing,
    isStillMutualFollow,
    resetStates,
    isLoading: createFollowMutation.isPending || deleteFollowMutation.isPending,
  };
}
