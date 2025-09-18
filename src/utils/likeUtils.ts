// 좋아요 상태 관련 유틸리티 함수들
import type { LikeStatus } from '@/types/stellarList';

export const likeUtils = {
  // 좋아요 가능한 상태인지 확인 (unknown이 아닌 상태)
  isLikeable: (status: LikeStatus): status is 'liked' | 'not_liked' => {
    return status !== 'unknown';
  },

  // 다음 좋아요 상태 반환
  getNextStatus: (current: LikeStatus): LikeStatus => {
    if (current === 'liked') return 'not_liked';
    if (current === 'not_liked') return 'liked';
    return 'unknown'; // unknown 상태는 변경하지 않음
  },

  // 좋아요 수 업데이트
  updateLikeCount: (current: number, isLiked: boolean): number => {
    return Math.max(0, current + (isLiked ? 1 : -1));
  },

  // boolean을 LikeStatus로 변환 (API 호환성)
  fromBoolean: (value: boolean | null): LikeStatus => {
    if (value === true) return 'liked';
    if (value === false) return 'not_liked';
    return 'unknown';
  },

  // LikeStatus를 boolean으로 변환 (API 호환성)
  toBoolean: (status: LikeStatus): boolean | null => {
    if (status === 'liked') return true;
    if (status === 'not_liked') return false;
    return null;
  },
};
