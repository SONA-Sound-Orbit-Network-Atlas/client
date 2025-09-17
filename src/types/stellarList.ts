// src/types/StellarList.ts

export interface StellarListItem {
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
  is_liked: boolean | null;
}

export interface StellarListMeta {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StellarListResponse {
  data: StellarListItem[];
  meta: StellarListMeta;
}

// 우리 앱에서 쓰는 어댑트 결과/플랫 결과 타입
export interface StellarListPage {
  list: StellarListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface FlattenedStellarList {
  list: StellarListItem[];
  totalCount: number;
}

// 공용 파라미터: COMMUNITY/MY 모두 사용
// COMMUNITY만 rank_type을 넘기고, MY는 생략(옵셔널)
export interface ParamsGetStellarList {
  page: number;
  limit: number;
  rank_type?: string; // STellarList에서만 사용
}

// 정렬 옵션(그대로)
export const sortOptions = [
  { label: 'TOP TOTAL', value: 'total' },
  { label: 'TOP WEEK', value: 'week' },
  { label: 'TOP MONTH', value: 'month' },
  { label: 'TOP YEAR', value: 'year' },
  { label: 'RANDOM', value: 'random' },
] as const;

export type SortLabel = (typeof sortOptions)[number]['label'];
export type SortValue = (typeof sortOptions)[number]['value'];

export function toSortValue(label: SortLabel): SortValue {
  const found = sortOptions.find((item) => item.label === label)!;
  return found.value;
}
