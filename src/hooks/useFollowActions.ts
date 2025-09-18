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

  // 팔로워 패널용 버튼 상태 확인
  const getFollowerButtonState = (user: {
    viewer_is_following: boolean;
    viewer_is_followed_by: boolean;
    isMutual: boolean;
  }) => {
    if (user.viewer_is_following) {
      return {
        text: '언팔로우',
        action: 'unfollow' as const,
        showMutualIcon: user.isMutual,
      };
    }

    if (user.viewer_is_followed_by) {
      return {
        text: '팔로우백',
        action: 'follow' as const,
        showMutualIcon: false,
      };
    }

    return {
      text: '팔로우',
      action: 'follow' as const,
      showMutualIcon: false,
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
        text: '언팔로우',
        action: 'unfollow' as const,
        showMutualIcon: user.isMutual,
      };
    }

    if (user.viewer_is_followed_by) {
      return {
        text: '팔로우백',
        action: 'follow' as const,
        showMutualIcon: false,
      };
    }

    return {
      text: '팔로우',
      action: 'follow' as const,
      showMutualIcon: false,
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

  // 상태 초기화 (메모이제이션)
  const resetStates = useCallback(() => {
    setUnfollowedUsers(new Set());
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
    isLoading: createFollowMutation.isPending || deleteFollowMutation.isPending,
  };
}
