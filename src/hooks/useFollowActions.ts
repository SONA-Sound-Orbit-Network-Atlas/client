import { useState, useCallback } from 'react';
import { useCreateFollow, useDeleteFollow } from '@/hooks/api/useFollow';

// 팔로우 액션 상태 관리 훅
export function useFollowActions() {
  const createFollowMutation = useCreateFollow();
  const deleteFollowMutation = useDeleteFollow();

  // 팔로우 상태를 위한 로컬 상태 관리
  const [unfollowedUsers, setUnfollowedUsers] = useState<Set<string>>(
    new Set()
  );
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  // 에러 상태 관리
  const [error, setError] = useState<string | null>(null);

  // 팔로우 핸들러
  const handleFollow = (userId: string) => {
    setError(null); // 에러 상태 초기화
    createFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 팔로잉 패널용 상태 업데이트
          setUnfollowedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });

          // 팔로워 패널용 상태 업데이트
          setFollowedUsers((prev) => new Set(prev).add(userId));
          setUnfollowedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        },
        onError: (error) => {
          console.error('팔로우 실패:', error);
          setError('팔로우 처리 중 오류가 발생했습니다.');
        },
      }
    );
  };

  // 언팔로우 핸들러
  const handleUnfollow = (userId: string) => {
    setError(null); // 에러 상태 초기화
    deleteFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 팔로잉 패널용 상태 업데이트
          setUnfollowedUsers((prev) => new Set(prev).add(userId));

          // 팔로워 패널용 상태 업데이트
          setFollowedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        },
        onError: (error) => {
          console.error('언팔로우 실패:', error);
          setError('언팔로우 처리 중 오류가 발생했습니다.');
        },
      }
    );
  };

  // 팔로워 패널용 버튼 상태 확인 (로컬 상태 고려)
  const getFollowerButtonState = (user: {
    id: string;
    viewer_is_following: boolean;
    viewer_is_followed_by: boolean;
    isMutual: boolean;
  }) => {
    // 로컬 상태 우선 확인
    const isFollowed = followedUsers.has(user.id);
    const isUnfollowed = unfollowedUsers.has(user.id);

    // 상대방이 나를 팔로우하고 있는 경우 (팔로우백 가능 상태)
    if (user.viewer_is_followed_by) {
      // 내가 이미 팔로우하고 있는 경우 (상호 팔로우)
      if (isFollowed || (user.viewer_is_following && !isUnfollowed)) {
        return {
          text: 'UNFOLLOW',
          action: 'unfollow' as const,
          showMutualIcon: true,
          isFollowBack: false,
        };
      }
      // 내가 팔로우하지 않는 경우 (팔로우백)
      return {
        text: 'FOLLOW BACK',
        action: 'follow' as const,
        showMutualIcon: false,
        isFollowBack: true,
      };
    }

    // 내가 팔로우하고 있지만 상대방이 나를 팔로우하지 않는 경우
    if (isFollowed || (user.viewer_is_following && !isUnfollowed)) {
      return {
        text: 'UNFOLLOW',
        action: 'unfollow' as const,
        showMutualIcon: false,
        isFollowBack: false,
      };
    }

    // 기본 팔로우 상태
    return {
      text: 'FOLLOW',
      action: 'follow' as const,
      showMutualIcon: false,
      isFollowBack: false,
    };
  };

  // 팔로잉 패널용 버튼 상태 확인 (로컬 상태 고려)
  const getFollowingButtonState = (user: {
    id: string;
    viewer_is_following: boolean;
    viewer_is_followed_by: boolean;
    isMutual: boolean;
  }) => {
    const isUnfollowed = unfollowedUsers.has(user.id);

    if (user.viewer_is_following && !isUnfollowed) {
      return {
        text: 'UNFOLLOW',
        action: 'unfollow' as const,
        showMutualIcon: user.isMutual,
        isFollowBack: false,
      };
    }

    if (user.viewer_is_followed_by) {
      return {
        text: 'FOLLOW BACK',
        action: 'follow' as const,
        showMutualIcon: false,
        isFollowBack: true,
      };
    }

    return {
      text: 'FOLLOW',
      action: 'follow' as const,
      showMutualIcon: false,
      isFollowBack: false,
    };
  };

  // 팔로워 패널용 상태 확인 함수들 (기존 호환성 유지)
  const isMutualFollow = (user: { isMutual: boolean }) => {
    return user.isMutual;
  };

  const isFollowBack = (user: {
    viewer_is_followed_by: boolean;
    viewer_is_following: boolean;
  }) => {
    return user.viewer_is_followed_by && !user.viewer_is_following;
  };

  const isFollowing = (user: { viewer_is_following: boolean }) => {
    return user.viewer_is_following;
  };

  // 팔로잉 패널용 상태 확인 함수들 (기존 호환성 유지)
  const isStillFollowing = (user: {
    id: string;
    viewer_is_following: boolean;
  }) => {
    return user.viewer_is_following && !unfollowedUsers.has(user.id);
  };

  const isStillMutualFollow = (user: { id: string; isMutual: boolean }) => {
    return user.isMutual && !unfollowedUsers.has(user.id);
  };

  // 에러 상태 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 상태 초기화 (메모이제이션)
  const resetStates = useCallback(() => {
    setUnfollowedUsers(new Set());
    setFollowedUsers(new Set());
    setError(null);
  }, []);

  return {
    handleFollow,
    handleUnfollow,
    // 새로운 버튼 상태 함수들
    getFollowerButtonState,
    getFollowingButtonState,
    // 기존 호환성 유지 함수들
    isMutualFollow,
    isFollowBack,
    isFollowing,
    isStillFollowing,
    isStillMutualFollow,
    resetStates,
    // 에러 관련
    error,
    clearError,
    isLoading: createFollowMutation.isPending || deleteFollowMutation.isPending,
  };
}
