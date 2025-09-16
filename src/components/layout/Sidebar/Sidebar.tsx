import { mergeClassNames } from '@/utils/mergeClassNames';
import PrimarySidebar from './SidebarNav/SidebarNav';
import SecondarySidebar from './SidebarPanel/SidebarPanel';
import { useSidebarStore } from '@/stores/useSidebarStore';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isSecondaryOpen } = useSidebarStore();

  return (
    <>
      <div className={mergeClassNames('flex h-full', className)}>
        <PrimarySidebar />
        {isSecondaryOpen && <SecondarySidebar />}
      </div>
    </>
  );
}
