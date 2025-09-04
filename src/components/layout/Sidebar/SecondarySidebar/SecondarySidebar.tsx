import { mergeClassNames } from '@/utils/mergeClassNames';
import { useSidebarStore } from '@/stores/sidebarStore';
import MenuContent from './MenuContent';
import { menuContents } from './constants';

export default function SecondarySidebar() {
  const { isSecondaryOpen, selectedMenu } = useSidebarStore();

  if (!isSecondaryOpen || !selectedMenu) return null;

  const content = menuContents[selectedMenu];
  if (!content) return null;

  return (
    <div
      className={mergeClassNames(
        'w-64 bg-gray-surface border-r border-gray-border',
        'p-4 flex flex-col gap-4'
      )}
    >
      {/* 메뉴 내용 */}
      <MenuContent content={content} menuId={selectedMenu} />
    </div>
  );
}
