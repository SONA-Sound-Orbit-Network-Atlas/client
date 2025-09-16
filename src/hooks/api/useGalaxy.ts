import { useSuspenseInfiniteQuery, type QueryKey } from '@tanstack/react-query';
import { galaxyAPI } from '@/api/galaxy';
import type {
  ParamsGetGalaxyCommunityList,
  GalaxyCommunityPage,
  FlattenedCommunity,
  GalaxyCommunityItem,
} from '@/types/galaxyCommunity';
import type {
  ParamsGetGalaxyMyList,
  GalaxyMyData,
  GalaxyMyListData,
} from '@/types/galaxyMy';

export function useGetGalaxyCommunityList(
  params: ParamsGetGalaxyCommunityList
) {
  return useSuspenseInfiniteQuery<
    GalaxyCommunityPage, // TQueryFnData: API 어댑트 반환
    Error, // TError
    FlattenedCommunity, // TData: select 이후
    QueryKey, // TQueryKey
    number // TPageParam
  >({
    queryKey: ['galaxyCommunityList', params.limit, params.rank_type],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      galaxyAPI.getGalaxyCommunityList({
        page: pageParam,
        limit: params.limit,
        rank_type: params.rank_type,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    select: (data) => {
      const list: GalaxyCommunityItem[] = data.pages.flatMap(
        (p) => p.list ?? []
      );
      const totalCount = data.pages[0]?.totalCount ?? 0;
      return { list, totalCount };
    },
  });
}

// Galaxy My 리스트 조회
type FlattenedMy = {
  list: GalaxyMyListData[];
  totalCount: number;
};

export function useGetGalaxyMyList(params: ParamsGetGalaxyMyList) {
  return useSuspenseInfiniteQuery<
    GalaxyMyData,
    Error,
    FlattenedMy,
    QueryKey,
    number
  >({
    queryKey: ['galaxyMyList', params.limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      galaxyAPI.getGalaxyMyList({
        page: pageParam,
        limit: params.limit,
      }),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const totalCount = lastPage.totalCount;
      const loadedCount = allPages.flatMap((p) => p.list).length;
      return loadedCount < totalCount ? lastPageParam + 1 : undefined;
    },
    select: (data) => {
      const list = data.pages.flatMap((p) => p.list);
      const totalCount = data.pages[0]?.totalCount ?? 0;
      return { list, totalCount };
    },
  });
}
