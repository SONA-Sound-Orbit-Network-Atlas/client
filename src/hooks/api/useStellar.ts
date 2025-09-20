// stellar system hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stellarAPI } from '@/api/stellar';
import type { StellarSystem } from '@/types/stellar';
import { toStellarWritePayload } from '@/types/stellarWrite';
import { stellarKeys } from './queryKeys/stellarKeys';
import { galaxyKeys } from './queryKeys/galaxyKeys';

// 조회
export function useGetStellar(stellarId: string) {
  return useQuery({
    queryKey: stellarKeys.detail(stellarId),
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
      // stellar 관련 캐시 무효화
      qc.invalidateQueries({ queryKey: stellarKeys.all });

      // galaxy 관련 리스트 캐시 무효화 (COMMUNITY, MY, 전체 스텔라 리스트)
      qc.invalidateQueries({ queryKey: galaxyKeys.all }); // 'stellar*' 시작하는 모든 쿼리 무효화
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
      queryClient.setQueryData(stellarKeys.detail(stellarId), data);

      // stellar 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: stellarKeys.all });

      // galaxy 관련 리스트 캐시 무효화 (COMMUNITY, MY, 전체 스텔라 리스트)
      queryClient.invalidateQueries({ queryKey: galaxyKeys.all }); // 'stellar*' 시작하는 모든 쿼리 무효화
    },
  });
}

// 삭제
export function useDeleteStellar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stellarId: string) => stellarAPI.deleteStellar(stellarId),
    onSuccess: () => {
      // stellar 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: stellarKeys.all });

      // galaxy 관련 리스트 캐시 무효화 (COMMUNITY, MY, 전체 스텔라 리스트)
      queryClient.invalidateQueries({ queryKey: galaxyKeys.all }); // 'stellar*' 시작하는 모든 쿼리 무효화
    },
  });
}

// 클론
export function useCloneStellar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stellarId: string) => stellarAPI.cloneStellar(stellarId),
    onSuccess: () => {
      // stellar 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: stellarKeys.all });

      // galaxy 관련 리스트 캐시 무효화 (COMMUNITY, MY, 전체 스텔라 리스트)
      queryClient.invalidateQueries({ queryKey: galaxyKeys.all }); // 'stellar*' 시작하는 모든 쿼리 무효화
    },
  });
}
