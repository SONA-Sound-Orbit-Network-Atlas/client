import type { MenuContent as MenuContentType } from './constants';

interface MenuContentProps {
  content: MenuContentType;
}

export default function MenuContent({ content }: MenuContentProps) {
  return (
    <>
      {/* 메뉴별 세부 옵션들 */}
      <div className="space-y-3">
        <div className="p-3 bg-gray-card rounded-lg">
          <div className="text-text-white text-sm font-medium">
            {content.title}
          </div>
        </div>
      </div>
    </>
  );
}
