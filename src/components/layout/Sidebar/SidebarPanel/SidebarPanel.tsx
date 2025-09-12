import { mergeClassNames } from '@/utils/mergeClassNames';
import { useSidebarStore } from '@/stores/usesidebarStore';
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
        'flex flex-col min-h-0'
      )}
    >
      {/* 메뉴 내용 */}
      <div className="flex-1 h-full overflow-y-auto">
        <MenuContent content={content} menuId={selectedMenu} />
      </div>
    </div>
  );
}
