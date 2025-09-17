import { useState, useCallback } from 'react';
import { useCreateFollow, useDeleteFollow } from '@/hooks/api/useFollow';

// 팔로우 액션 상태 관리 훅
export function useFollowActions() {
  const createFollowMutation = useCreateFollow();
  const deleteFollowMutation = useDeleteFollow();

  // 팔로우 상태를 위한 로컬 상태 관리
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [unfollowedUsers, setUnfollowedUsers] = useState<Set<string>>(
    new Set()
  );
  const [mutualFollows, setMutualFollows] = useState<Set<string>>(new Set());

  // 팔로우 핸들러
  const handleFollow = (userId: string) => {
    createFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 로컬 상태 업데이트: 팔로우한 사용자를 followedUsers에 추가
          setFollowedUsers((prev) => new Set(prev).add(userId));
          // 맞팔로우 상태로 업데이트
          setMutualFollows((prev) => new Set(prev).add(userId));
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
          // 로컬 상태 업데이트: 언팔로우한 사용자를 제거
          setFollowedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
          setUnfollowedUsers((prev) => new Set(prev).add(userId));
          setMutualFollows((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        },
        onError: (error) => {
          console.error('언팔로우 실패:', error);
          // TODO: 토스트 메시지로 사용자에게 에러 알림
        },
      }
    );
  };

  // 팔로우 상태 확인 (팔로워 패널용)
  const isFollowing = (userId: string, isMutualFromAPI: boolean) => {
    return followedUsers.has(userId) || isMutualFromAPI;
  };

  // 맞팔로우 상태 확인 (팔로워 패널용)
  const isMutualFollow = (userId: string, isMutualFromAPI: boolean) => {
    return mutualFollows.has(userId) || isMutualFromAPI;
  };

  // 팔로잉 상태 확인 (팔로잉 패널용)
  const isStillFollowing = (userId: string) => {
    return !unfollowedUsers.has(userId);
  };

  // 맞팔로우 상태 확인 (팔로잉 패널용)
  const isStillMutualFollow = (userId: string, isMutualFromAPI: boolean) => {
    return isMutualFromAPI && !unfollowedUsers.has(userId);
  };

  // 상태 초기화 (메모이제이션)
  const resetStates = useCallback(() => {
    setFollowedUsers(new Set());
    setUnfollowedUsers(new Set());
    setMutualFollows(new Set());
  }, []);

  return {
    handleFollow,
    handleUnfollow,
    isFollowing,
    isMutualFollow,
    isStillFollowing,
    isStillMutualFollow,
    resetStates,
    isLoading: createFollowMutation.isPending || deleteFollowMutation.isPending,
  };
}
