import type { FollowPanelType } from '@/types/follow';

// 팔로우 패널 설정 매핑
export const followPanelConfig = {
  followers: {
    title: 'FOLLOWERS',
    emptyMessage: '팔로워가 없습니다.',
    errorMessage: '팔로워 목록을 불러오는데 실패했습니다.',
    loadCompleteMessage: '모든 팔로워를 불러왔습니다',
  },
  followings: {
    title: 'FOLLOWINGS',
    emptyMessage: '팔로잉이 없습니다.',
    errorMessage: '팔로잉 목록을 불러오는데 실패했습니다.',
    loadCompleteMessage: '모든 팔로잉을 불러왔습니다',
  },
} as const;

// 설정 가져오기 헬퍼 함수
export const getFollowPanelConfig = (type: FollowPanelType) => {
  return followPanelConfig[type];
};
