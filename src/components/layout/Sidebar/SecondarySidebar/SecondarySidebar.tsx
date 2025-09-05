import { mergeClassNames } from '@/utils/mergeClassNames';
import { useSidebarStore } from '@/stores/sidebarStore';
import MenuContent from './MenuContent';
import { menuContents } from './constants';
import { ScrollArea } from '@/components/common/scroll-area';

export default function SecondarySidebar() {
  const { isSecondaryOpen, selectedMenu } = useSidebarStore();

  if (!isSecondaryOpen || !selectedMenu) return null;

  const content = menuContents[selectedMenu];
  if (!content) return null;

  return (
    <div
      className={mergeClassNames(
        'w-64 bg-gray-surface border-r border-gray-border',
        'flex flex-col h-full'
      )}
    >
      {/* 메뉴 내용 */}
      <ScrollArea className="flex-1 h-0">
        <div>
          <MenuContent content={content} menuId={selectedMenu} />
        </div>
      </ScrollArea>
    </div>
  );
}
