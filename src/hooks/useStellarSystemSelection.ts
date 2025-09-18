// useStellarSystemSelection.ts
import { useCallback, useEffect, useState } from 'react';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarTabStore } from '@/stores/useStellarTabStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useGetStellar } from '@/hooks/api/useStellar';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

export default function useStellarSystemSelection() {
  const { selectedStellarId, setSelectedStellarId } = useSelectedStellarStore();
  const { setStellarStore } = useStellarStore();
  const { setTabValue } = useStellarTabStore();
  const { openSecondarySidebar } = useSidebarStore();
  const { setSelectedObjectId } = useSelectedObjectStore();

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
      setStellarStore(data); // 스텔라 스토어 업데이트
      setSelectedStellarId(targetId); // 선택된 스텔라 아이디 업데이트
      setSelectedObjectId(data.star.id); // 선택된 오브젝트 아이디 업데이트 => 항성 기본값
      setTabValue('INFO'); // 스텔라 패널 > 탭 값 업데이트
      openSecondarySidebar('stellar'); // 스텔라 패널 오픈
      setTargetId(''); // 타겟 아이디 초기화
    }
  }, [
    status,
    data,
    targetId,
    setStellarStore,
    setSelectedStellarId,
    setTabValue,
    openSecondarySidebar,
    setSelectedObjectId,
  ]);

  return {
    selectStellar,
    status, // 'idle' | 'pending' | 'error' | 'success'
    isLoading: status === 'pending',
    error,
    currentTargetId: targetId,
  };
}
