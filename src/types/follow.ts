// 팔로우 관련 타입 정의
import type { User } from './user';

// ===== 기본 타입 =====
export interface FollowRequest {
  targetUserId: string;
}

export interface FollowStats {
  userId: string;
  followersCount: number;
  followingsCount: number;
}

export interface FollowError {
  statusCode: number;
  message: string;
  error: string;
}

// ===== API 에러 응답 =====
export interface APIErrorResponse {
  error: {
    code: number;
    message: string;
  };
  timestamp: string;
  path: string;
}

// ===== 페이지네이션 =====
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean; // 서버에서 제공하지 않을 수 있음
  hasPrev?: boolean; // 서버에서 제공하지 않을 수 있음
}

// ===== 팔로우 사용자 타입 =====
// 공통 팔로우 사용자 인터페이스
export interface FollowUser extends User {
  viewer_is_following: boolean; // 내가 상대방을 팔로우하고 있는지
  viewer_is_followed_by: boolean; // 상대방이 나를 팔로우하고 있는지
  isMutual: boolean; // 상호 팔로우 여부 (viewer_is_following && viewer_is_followed_by)
}

// 팔로워와 팔로잉은 동일한 구조이므로 별칭으로 정의
export type FollowerUser = FollowUser;
export type FollowingUser = FollowUser;

// ===== API 응답 타입 =====
// 제네릭을 사용한 공통 응답 타입
export interface FollowListResponse<T extends FollowUser> {
  meta: PaginationMeta;
  items: T[];
}

// 구체적인 응답 타입들
export type FollowersResponse = FollowListResponse<FollowerUser>;
export type FollowingsResponse = FollowListResponse<FollowingUser>;

// ===== API 파라미터 =====
// 공통 API 파라미터 인터페이스
export interface FollowListParams {
  targetId: string;
  page?: number;
  limit?: number;
}

// 구체적인 파라미터 타입들
export type GetFollowersParams = FollowListParams;
export type GetFollowingsParams = FollowListParams;

// ===== 훅 옵션 =====
export interface UseFollowListOptions {
  targetId: string;
  page?: number; // useInfiniteQuery에서는 page가 필요하지 않음
  limit?: number;
}

// ===== 컴포넌트 Props =====
export type FollowPanelType = 'followers' | 'followings';

export interface FollowListPanelProps {
  type: FollowPanelType;
  targetUserId: string | null;
  onBack?: () => void;
}
