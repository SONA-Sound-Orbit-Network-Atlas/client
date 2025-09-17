/**
 * 사용자 관련 상수
 */

// 사용자 ID 접두사
export const USER_ID_PREFIX = 'cmf_user_' as const;

// 사용자 ID 관련 유틸리티 함수
export const userUtils = {
  /**
   * 숫자 ID를 사용자 ID 형식으로 변환
   * @param numericId 숫자 ID
   * @returns 사용자 ID (예: "cmf_user_123")
   */
  createUserId: (numericId: number): string => {
    return `${USER_ID_PREFIX}${numericId}`;
  },

  /**
   * 사용자 ID에서 숫자 ID 추출
   * @param userId 사용자 ID (예: "cmf_user_123")
   * @returns 숫자 ID (예: 123)
   */
  extractNumericId: (userId: string): number => {
    return parseInt(userId.replace(USER_ID_PREFIX, ''));
  },

  /**
   * 사용자 ID 형식인지 확인
   * @param userId 확인할 ID
   * @returns 사용자 ID 형식 여부
   */
  isUserId: (userId: string): boolean => {
    return userId.startsWith(USER_ID_PREFIX);
  },
} as const;
