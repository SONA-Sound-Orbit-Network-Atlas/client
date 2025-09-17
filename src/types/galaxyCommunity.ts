export interface GalaxyCommunityItem {
  id: string;
  title: string;
  galaxy_id: string;
  creator_id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  planet_count: number;
  rank: number;
  // myFavorite: boolean | null;
}

export interface GalaxyCommunityMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GalaxyCommunityResponse {
  data: GalaxyCommunityItem[];
  meta: GalaxyCommunityMeta;
}

// 우리 앱에서 쓰는 어댑트 결과/플랫 결과 타입
export interface GalaxyCommunityPage {
  list: GalaxyCommunityItem[];
  totalCount: number;
  page: number;
  hasNext: boolean;
}

export interface FlattenedCommunity {
  list: GalaxyCommunityItem[];
  totalCount: number;
}

// Galaxy Community 데이터 => 평탄화 타입
// export type GalaxyCommunityData = {
//   list: BackendItem[];
//   totalCount: number;
//   page: number;
//   hasNext: boolean;
// };

// Galaxy Community - List 데이터
// export interface GalaxyCommunityListData {
//   id: string;
//   title: string;
//   galaxy_id: string;
//   creator_id: string;
//   author_id: string;
//   created_at: string;
//   updated_at: string;
//   planet_count: number;
//   like_count: number;
//   myFavorite: boolean | null; // 로그인 상태면 true/false, 비로그인 상태면 null
//   rank: number;
// }

// 은하 목록 조회 파라미터
export interface ParamsGetGalaxyCommunityList {
  page: number;
  limit: number;
  rank_type: string;
}

// 은하 목록 정렬 타입
// 1) 옵션 정의 (드롭다운에서 보여주는 값: label / api에 전달하는 값: value)
export const sortOptions = [
  { label: 'TOP WEEK', value: 'week' },
  { label: 'TOP MONTH', value: 'month' },
  { label: 'TOP YEAR', value: 'year' },
  { label: 'RANDOM', value: 'random' },
] as const;

// 2) 타입 추론
export type SortLabel = (typeof sortOptions)[number]['label'];
export type SortValue = (typeof sortOptions)[number]['value'];

// 3) 라벨→값 변환 유틸
export function toSortValue(label: SortLabel): SortValue {
  // Array.prototype.find의 반환 타입은 기본적 => T | undefined ==> 그래서 ! 사용 (null 아님 단언)
  const found = sortOptions.find((item) => item.label === label)!;
  return found.value;
}
