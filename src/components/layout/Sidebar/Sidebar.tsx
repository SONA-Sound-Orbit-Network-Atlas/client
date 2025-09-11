import { mergeClassNames } from '@/utils/mergeClassNames';
import PrimarySidebar from './SidebarNav/SidebarNav';
import SecondarySidebar from './SidebarPanel/SidebarPanel';
import { useSidebarStore } from '@/stores/sidebarStore';
import StellarDataBinder from '@/components/stellarDataBinder/StellarDataBinder';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isSecondaryOpen } = useSidebarStore();

  return (
    <>
      {/* StellarDataBinder: 항시 구독해있도록 Sidebar 컴포넌트에 마운트 */}
      <StellarDataBinder />

      <div className={mergeClassNames('flex h-full', className)}>
        <PrimarySidebar />
        {isSecondaryOpen && <SecondarySidebar />}
      </div>
    </>
  );
}
