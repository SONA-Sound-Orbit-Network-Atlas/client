import type { FollowerUser, FollowingUser } from '@/types/follow';

// 팔로우 관계를 계산하는 유틸리티 함수
export const calculateFollowRelation = (
  myFollowings: FollowingUser[],
  targetFollowers: FollowerUser[],
  targetUserId: string,
  currentUserId: string
) => {
  const viewer_is_following = myFollowings.some(
    (user) => user.id === targetUserId
  );
  const viewer_is_followed_by = targetFollowers.some(
    (user) => user.id === currentUserId
  );
  const isMutual = viewer_is_following && viewer_is_followed_by;

  return {
    viewer_is_following,
    viewer_is_followed_by,
    isMutual,
  };
};
