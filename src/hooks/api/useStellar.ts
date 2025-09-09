// stellar system hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stellarAPI } from '@/api/stellar';
import type { StellarType } from '@/types/stellar';

// 생성
export function useCreateStellar(stellarData: StellarType) {
  return useMutation({
    mutationFn: () => stellarAPI.createStellar(stellarData),
  });
}

// 조회
export function useGetStellar(stellarId: string) {
  return useQuery({
    queryKey: ['stellar', stellarId],
    queryFn: () => stellarAPI.getStellar(stellarId),
  });
}

// 수정
export function useUpdateStellar(stellarId: string, stellarData: StellarType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stellarAPI.updateStellar(stellarId, stellarData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stellar', stellarId] });
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
    },
  });
}
