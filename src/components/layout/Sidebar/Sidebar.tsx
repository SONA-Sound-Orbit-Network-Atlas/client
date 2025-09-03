import { mergeClassNames } from '@/utils/mergeClassNames';
import PrimarySidebar from './PrimarySidebar/PrimarySidebar';
import SecondarySidebar from './SecondarySidebar/SecondarySidebar';
import { useSidebarStore } from '@/stores/sidebarStore';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isSecondaryOpen } = useSidebarStore();

  return (
    <div className={mergeClassNames('flex h-full', className)}>
      <PrimarySidebar />
      {isSecondaryOpen && <SecondarySidebar />}
    </div>
  );
}
