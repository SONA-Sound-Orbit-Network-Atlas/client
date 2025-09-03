import { useInfiniteQuery } from '@tanstack/react-query';
import { galaxyAPI } from '@/api/galaxy';
import type { ParamsGetGalaxyList } from '@/types/galaxy';

// 은하 목록 조회
export function useGetGalaxyList(params: ParamsGetGalaxyList) {
  return useInfiniteQuery({
    queryKey: ['galaxyList', params],
    queryFn: ({ pageParam }) =>
      galaxyAPI.getGalaxyList({
        page: pageParam,
        limit: params.limit,
        sort: params.sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length < params.limit ? undefined : lastPageParam + 1,
  });
}
