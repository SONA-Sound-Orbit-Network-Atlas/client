// stellar system hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stellarAPI } from '@/api/stellar';
import type { StellarType } from '@/types/stellar';
import { useStellarStore } from '@/stores/useStellarStore';
import { useEffect } from 'react';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useStellarTabStore } from '@/stores/useStellarTabStore';

// 생성
export function useCreateStellar(stellarData: StellarType) {
  return useMutation({
    mutationFn: () => stellarAPI.createStellar(stellarData),
  });
}

// 조회
// 갤럭시 id 값 변경 => 스텔라 정보 api 호출 및 갱신 후 => 스토어에 저장
export function useGetStellar() {
  const { selectedStellarId } = useSelectedStellarStore();
  const { setStellarStore } = useStellarStore();
  const { openSecondarySidebar } = useSidebarStore();
  const { setTabValue } = useStellarTabStore();

  const query = useQuery<StellarType>({
    queryKey: ['stellar', selectedStellarId],
    queryFn: () => stellarAPI.getStellar(selectedStellarId),
    enabled: !!selectedStellarId,
    // v5: onSuccess 없음 => useEffect 사용 권장
  });

  // 스텔라 정보 api 호출 및 갱신 후 => 스토어에 저장
  useEffect(() => {
    if (!selectedStellarId) return;
    if (!query.data) return;

    setStellarStore(query.data);
    console.log('query.data', query.data);
    // stellar 패널로 이동
    setTabValue('INFO');
    openSecondarySidebar('stellar');
  }, [
    query.data,
    setStellarStore,
    openSecondarySidebar,
    selectedStellarId,
    setTabValue,
  ]);

  return query;
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
