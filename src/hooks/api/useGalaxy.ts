import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { galaxyAPI } from '@/api/galaxy';
import type { ParamsGetGalaxyCommunityList } from '@/types/galaxyCommunity';
import type { ParamsGetGalaxyMyList } from '@/types/galaxyMy';

// Galaxy Community 리스트 조회
export function useGetGalaxyCommunityList(
  params: ParamsGetGalaxyCommunityList
) {
  return useSuspenseInfiniteQuery({
    queryKey: ['galaxyCommunityList', params],
    queryFn: ({ pageParam }) =>
      galaxyAPI.getGalaxyCommunityList({
        page: pageParam,
        limit: params.limit,
        sort: params.sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length < params.limit ? undefined : lastPageParam + 1,
  });
}

// Galaxy My 리스트 조회
export function useGetGalaxyMyList(params: ParamsGetGalaxyMyList) {
  return useSuspenseInfiniteQuery({
    queryKey: ['galaxyMyList', params],
    queryFn: ({ pageParam }) =>
      galaxyAPI.getGalaxyMyList({ page: pageParam, limit: params.limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length < params.limit ? undefined : lastPageParam + 1,
  });
}
