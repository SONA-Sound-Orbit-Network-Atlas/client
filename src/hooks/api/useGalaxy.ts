import {
  useSuspenseInfiniteQuery,
  useQuery,
  type QueryKey,
} from '@tanstack/react-query';
import { galaxyAPI } from '@/api/galaxy';
import type {
  ParamsGetGalaxyCommunityList,
  GalaxyCommunityData,
  GalaxyCommunityListData,
} from '@/types/galaxyCommunity';
import type {
  ParamsGetGalaxyMyList,
  GalaxyMyData,
  GalaxyMyListData,
} from '@/types/galaxyMy';

// Galaxy Community 리스트 조회
type FlattenedCommunity = {
  list: GalaxyCommunityListData[];
  totalCount: number;
};

export function useGetGalaxyCommunityList(
  params: ParamsGetGalaxyCommunityList
) {
  return useSuspenseInfiniteQuery<
    GalaxyCommunityData, // 서버 원본 페이지 타입
    Error, // 에러 타입
    FlattenedCommunity, // 최종적으로 컴포넌트에서 data로 받을 타입 (select 적용 후)
    QueryKey, // queryKey 타입
    number // pageParam 타입
  >({
    queryKey: ['galaxyCommunityList', params.limit, params.sort],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      galaxyAPI.getGalaxyCommunityList({
        page: pageParam,
        limit: params.limit,
        sort: params.sort,
      }),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const totalCount = lastPage.totalCount;
      const loadedCount = allPages.flatMap((p) => p.list).length;
      return loadedCount < totalCount ? lastPageParam + 1 : undefined;
    },
    select: (data) => {
      // useQuery가 컴포넌트에 넘겨주는 data가 바뀐 형태
      const list = data.pages.flatMap((p) => p.list);
      const totalCount = data.pages[0]?.totalCount ?? 0; // 첫 페이지 메타 사용
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

/**
 * Galaxy 데이터를 React Query로 관리하는 간단한 훅
 * 전체 스텔라 리스트를 가져옴
 */
export const useGalaxy = (galaxyId: string) => {
  return useQuery({
    queryKey: ['galaxy', galaxyId],
    queryFn: () => galaxyAPI.getAllStellarList({ id: galaxyId }),
    enabled: !!galaxyId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
