import { mergeClassNames } from '@/utils/mergeClassNames';
import PrimarySidebar from './SidebarNav/SidebarNav';
import SecondarySidebar from './SidebarPanel/SidebarPanel';
import { useSidebarStore } from '@/stores/useSidebarStore';
import StellarDataBinder from '@/components/stellarDataBinder/StellarDataBinder';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isSecondaryOpen } = useSidebarStore();

  return (
    <>
      {/* StellarDataBinder: 항시 구독해있도록 Sidebar 컴포넌트에 마운트 
      기존의 api 훅 구독 방식이 selectedStellarId 변경 시 useEffect 훅 호출되어 동작하는 방식이었음
      현재는 useStellarSystemSelection 훅을 사용하여, 리스트 "선택"시 라는 통합 훅으로 처리되어 스토어에 저장하고 패널 열기 처리
      useStellarSystemSelection 방식이 정상 동작하면 추후 삭제 예정
      */}
      {/* <StellarDataBinder /> */}

      <div className={mergeClassNames('flex h-full', className)}>
        <PrimarySidebar />
        {isSecondaryOpen && <SecondarySidebar />}
      </div>
    </>
  );
}
