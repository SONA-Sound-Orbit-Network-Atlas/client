// 좋아요 상태 관련 유틸리티 함수들
export const likeUtils = {
  // 좋아요 가능한 상태인지 확인 (null이 아닌 상태)
  isLikeable: (status: boolean | null): status is boolean => {
    return status !== null;
  },

  // 다음 좋아요 상태 반환
  getNextStatus: (current: boolean): boolean => {
    return !current;
  },

  // 좋아요 수 업데이트
  updateLikeCount: (current: number, isLiked: boolean): number => {
    return Math.max(0, current + (isLiked ? 1 : -1));
  },
};
