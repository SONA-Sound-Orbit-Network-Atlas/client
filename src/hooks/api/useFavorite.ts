// hooks/api/useFavorite.ts
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { favoriteAPI } from '@/api/favorite';
import type { GalaxyCommunityData } from '@/types/stellarList';

type CommunityInfinite = InfiniteData<GalaxyCommunityData>;

function patchFavorite(
  prev: CommunityInfinite,
  targetId: string,
  nextFavorite: boolean
): CommunityInfinite {
  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      list: page.list.map((item) =>
        item.id === targetId
          ? {
              ...item,
              myFavorite: nextFavorite,
              favoriteCount: Math.max(
                0,
                item.favoriteCount + (nextFavorite ? 1 : -1)
              ),
            }
          : item
      ),
    })),
  };
}

// 좋아요 등록
export function useCreateFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ targetId }: { targetId: string }) =>
      favoriteAPI.createFavorite(targetId),

    // onMutate: mutationFn이 실행되기 "직전"에 동기/비동기로 호출됨.
    // 1) 낙관적 업데이트 (서버 응답을 기다리지 않고 캐시를 먼저 수정해 UI를 즉시 반응시키기
    // 서버응답으로 처리하는게 아니기 때문에, 롤백에 필요한 스냅샷 생성 => onError, onSettled에서 ctx로 받을 수 있다.
    onMutate: async ({ targetId }) => {
      await qc.cancelQueries({ queryKey: ['galaxyCommunityList'] });

      // qc.getQueriesData({ queryKey }) : 메모리에 있는 쿼리 데이터 -> [queryKey, data] 튜플 배열로로 반환
      const snapshots = qc.getQueriesData<CommunityInfinite>({
        queryKey: ['galaxyCommunityList'],
      });

      // qc.setQueryData(queryKey, updater) : 특정 쿼리 캐시의 데이터를 즉시 교체
      // 여기서 InfiniteData 구조를 그대로 유지한 채 pages[].list[] 안의 특정 아이템만 수정한다.
      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<CommunityInfinite>(
          key,
          patchFavorite(data, targetId, true)
        );
      });

      return { snapshots };
    },

    // 실패 시 롤백
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    // 성공/실패 여부와 상관없이 마지막에 호출됨
    // 2) 정합용 invalidate (이미 로드된 페이지 수는 유지됨 : queryKey가 바뀌지 않는 한)
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: ['galaxyCommunityList'],
        refetchType: 'active',
      });
    },
  });
}

// 좋아요 삭제
export function useDeleteFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ targetId }: { targetId: string }) =>
      favoriteAPI.deleteFavorite(targetId),

    onMutate: async ({ targetId }) => {
      await qc.cancelQueries({ queryKey: ['galaxyCommunityList'] });

      const snapshots = qc.getQueriesData<CommunityInfinite>({
        queryKey: ['galaxyCommunityList'],
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<CommunityInfinite>(
          key,
          patchFavorite(data, targetId, false)
        );
      });

      return { snapshots };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: ['galaxyCommunityList'],
        refetchType: 'active',
      });
    },
  });
}
