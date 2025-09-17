// stellar system hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stellarAPI } from '@/api/stellar';
import type { StellarSystem } from '@/types/stellar';
import { toStellarWritePayload } from '@/types/stellarWrite';

// 조회
export function useGetStellar(stellarId: string) {
  return useQuery({
    queryKey: ['stellar', stellarId],
    queryFn: () => stellarAPI.getStellar(stellarId),
    enabled: !!stellarId,
  });
}

// 생성
export function useCreateStellar() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (system: StellarSystem) => {
      const payload = toStellarWritePayload(system);
      return stellarAPI.createStellar(payload);
    },
    onSuccess: () => {
      // 목록/상위 캐시 무효화
      qc.invalidateQueries({ queryKey: ['stellar'] });
      qc.invalidateQueries({ queryKey: ['stellarList'] });
      qc.invalidateQueries({ queryKey: ['stellarMyList'] });
      qc.invalidateQueries({ queryKey: ['stellarListAll'] });
    },
  });
}

// 수정
export function useUpdateStellar() {
  const queryClient = useQueryClient();

  return useMutation<
    StellarSystem,
    Error,
    { stellarId: string; stellarData: StellarSystem }
  >({
    mutationFn: ({ stellarId, stellarData }) => {
      const payload = toStellarWritePayload(stellarData);
      return stellarAPI.updateStellar(stellarId, payload);
    },
    onSuccess: (data, { stellarId }) => {
      // 상세 캐시 갱신
      queryClient.setQueryData(['stellar', stellarId], data);
      // 목록 등 연관 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['stellar'] });
      queryClient.invalidateQueries({ queryKey: ['stellarList'] });
      queryClient.invalidateQueries({ queryKey: ['stellarMyList'] });
      queryClient.invalidateQueries({ queryKey: ['stellarListAll'] });
    },
  });
}

// 삭제
export function useDeleteStellar(stellarId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stellarAPI.deleteStellar(stellarId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stellar', stellarId] });
      queryClient.invalidateQueries({ queryKey: ['stellarList'] });
      queryClient.invalidateQueries({ queryKey: ['stellarMyList'] });
      queryClient.invalidateQueries({ queryKey: ['stellarListAll'] });
    },
  });
}
