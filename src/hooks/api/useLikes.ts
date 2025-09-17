// hooks/api/useFavorite.ts
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { likesAPI } from '@/api/likes';
import type { StellarListPage } from '@/types/stellarList';

// 무한스크롤 페이지 타입
type StellarInfinite = InfiniteData<StellarListPage>;

// 낙관적 업데이트용 패치 함수
function patchLike(
  prev: StellarInfinite,
  system_id: string,
  nextLike: boolean
): StellarInfinite {
  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      list: page.list.map((item) =>
        item.id === system_id
          ? {
              ...item,
              is_liked: nextLike,
              like_count: Math.max(0, item.like_count + (nextLike ? 1 : -1)),
            }
          : item
      ),
    })),
  };
}

const LIST_QUERY_KEY: QueryKey = ['stellarList'];

/** 좋아요 등록 */
export function useCreateLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ system_id }: { system_id: string }) =>
      likesAPI.createLike(system_id),

    // 낙관적 업데이트
    onMutate: async ({ system_id }) => {
      await qc.cancelQueries({ queryKey: LIST_QUERY_KEY });

      // 현재 캐시 스냅샷 저장
      const snapshots = qc.getQueriesData<StellarInfinite>({
        queryKey: LIST_QUERY_KEY,
      });

      // 캐시 패치
      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<StellarInfinite>(key, patchLike(data, system_id, true));
      });

      return { snapshots };
    },

    // 실패 시 롤백
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    // 성공/실패 무관 재검증
    onSettled: () => {
      qc.invalidateQueries({ queryKey: LIST_QUERY_KEY, refetchType: 'active' });
    },
  });
}

/** 좋아요 삭제 */
export function useDeleteLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ system_id }: { system_id: string }) =>
      likesAPI.deleteLike(system_id),

    onMutate: async ({ system_id }) => {
      await qc.cancelQueries({ queryKey: LIST_QUERY_KEY });

      const snapshots = qc.getQueriesData<StellarInfinite>({
        queryKey: LIST_QUERY_KEY,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<StellarInfinite>(
          key,
          patchLike(data, system_id, false)
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
      qc.invalidateQueries({ queryKey: LIST_QUERY_KEY, refetchType: 'active' });
    },
  });
}
