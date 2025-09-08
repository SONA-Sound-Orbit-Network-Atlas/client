import { mergeClassNames } from '@/utils/mergeClassNames';
import { useSidebarStore } from '@/stores/sidebarStore';
import MenuContent from './MenuContent';
import { menuContents } from './constants';
import { ScrollArea } from '@/components/common/Scrollarea';

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
      <ScrollArea className="flex-1 h-full">
        <div>
          <MenuContent content={content} menuId={selectedMenu} />
        </div>
      </ScrollArea>
    </div>
  );
}
