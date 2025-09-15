// useStellarSystemSelection.ts
import { useCallback, useEffect, useState } from 'react';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarTabStore } from '@/stores/useStellarTabStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useGetStellar } from '@/hooks/api/useStellar';

export default function useStellarSystemSelection() {
  const { selectedStellarId, setSelectedStellarId } = useSelectedStellarStore();
  const { setStellarStore } = useStellarStore();
  const { setTabValue } = useStellarTabStore();
  const { openSecondarySidebar } = useSidebarStore();
  //test용

  // 클릭으로 트리거할 내부 id
  const [targetId, setTargetId] = useState<string>('');

  // targetId 가 있을 때만 패칭
  const { data, status, error } = useGetStellar(targetId);

  // 클릭 시 호출
  const selectStellar = useCallback(
    (id: string) => {
      // 이미 선택된 경우: 패널만 정리하고 끝
      if (id === selectedStellarId) {
        setTabValue('INFO');
        openSecondarySidebar('stellar');
        return;
      }
      setTargetId(id); // 여기서부터 useGetStellar 활성화
    },
    [selectedStellarId, setTabValue, openSecondarySidebar]
  );

  // 패칭 완료 시 커밋
  useEffect(() => {
    if (status === 'success' && data) {
      console.log('=============================data : ', data);
      setStellarStore(data);
      setSelectedStellarId(targetId);
      setTabValue('INFO');
      openSecondarySidebar('stellar');
      setTargetId('');
      // 필요 시: setTargetId(''); // 다음 클릭 전까지 비활성화 하고 싶다면
    }
  }, [
    status,
    data,
    targetId,
    setStellarStore,
    setSelectedStellarId,
    setTabValue,
    openSecondarySidebar,
  ]);

  return {
    selectStellar,
    status, // 'idle' | 'pending' | 'error' | 'success'
    isLoading: status === 'pending',
    error,
    currentTargetId: targetId,
  };
}
