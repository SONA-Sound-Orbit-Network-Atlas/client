// 팔로우 관련 타입 정의
import type { User } from './user';

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

// 페이지네이션 메타데이터
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

// 팔로워 정보 (User 타입 확장)
export interface FollowerUser extends User {
  isMutual: boolean; // 상호 팔로우 여부
}

// 팔로워 목록 응답 (Swagger 스펙에 맞는 올바른 구조)
export interface FollowersResponse {
  meta: PaginationMeta;
  items: FollowerUser[];
}

// 실제 백엔드 응답 구조 (잘못된 구조 - 임시용)
export interface FollowersResponseRaw {
  page: number;
  limit: number;
  total: number | number[]; // 실제로는 Array(2) 형태로 오는 경우가 있음
  items: FollowerUser[];
}

// API 파라미터
export interface GetFollowersParams {
  userId: string;
  page?: number;
  limit?: number;
}
