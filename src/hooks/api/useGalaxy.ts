import {
  useSuspenseInfiniteQuery,
  useQuery,
  type QueryKey,
} from '@tanstack/react-query';
import { stellarListAPI } from '@/api/stellarList';
import type {
  StellarListItem,
  StellarListPage,
  FlattenedStellarList,
  ParamsGetStellarList,
} from '@/types/stellarList';

// COMMUNITY 리스트
export function useGetStellarList(params: ParamsGetStellarList) {
  return useSuspenseInfiniteQuery<
    StellarListPage, // queryFn 반환
    Error,
    FlattenedStellarList, // select 이후
    QueryKey,
    number // pageParam
  >({
    queryKey: ['stellarList', params.limit, params.rank_type],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      stellarListAPI.getStellarListList({
        page: pageParam,
        limit: params.limit,
        rank_type: params.rank_type, // COMMUNITY에서만 사용
      }),
    getNextPageParam: (lastPage) =>
      lastPage.total > lastPage.page * lastPage.limit
        ? lastPage.page + 1
        : undefined,
    select: (data) => {
      const list: StellarListItem[] = data.pages.flatMap((p) => p.list ?? []);
      const totalCount = data.pages[0]?.total ?? 0;
      return { list, totalCount };
    },
  });
}

// MY 리스트 (rank_type 없음)
export function useGetStellarMyList(params: ParamsGetStellarList) {
  return useSuspenseInfiniteQuery<
    StellarListPage,
    Error,
    FlattenedStellarList,
    QueryKey,
    number
  >({
    queryKey: ['stellarMyList', params.limit, params.page],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      stellarListAPI.getStellarMyList({
        page: pageParam,
        limit: params.limit,
        // rank_type 미전달
      }),
    getNextPageParam: (lastPage) =>
      lastPage.total > lastPage.page * lastPage.limit
        ? lastPage.page + 1
        : undefined,
    select: (data) => {
      const list = data.pages.flatMap((p) => p.list ?? []);
      console.log('=================data.pages', data.pages);
      const totalCount = data.pages[0]?.total ?? 0;
      return { list, totalCount };
    },
  });
}

// 전체 스텔라 리스트 조회 (pagination 없음)
export const useStellarList = (galaxyId: string) => {
  return useQuery({
    queryKey: ['stellarListAll', galaxyId],
    queryFn: () => stellarListAPI.getAllStellarList({ id: galaxyId }),
    enabled: !!galaxyId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
