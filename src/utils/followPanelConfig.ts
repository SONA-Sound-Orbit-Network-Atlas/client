import type { FollowPanelType } from '@/types/follow';

// 팔로우 패널 설정 매핑
export const followPanelConfig = {
  followers: {
    title: 'FOLLOWERS',
    emptyMessage: 'no followers',
    errorMessage: 'failed to load followers',
    loadCompleteMessage: 'loaded all followers',
  },
  followings: {
    title: 'FOLLOWINGS',
    emptyMessage: 'no followings',
    errorMessage: 'failed to load followings',
    loadCompleteMessage: 'loaded all followings',
  },
} as const;

// 설정 가져오기 헬퍼 함수
export const getFollowPanelConfig = (type: FollowPanelType) => {
  return followPanelConfig[type];
};
