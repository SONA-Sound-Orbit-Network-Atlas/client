import { mergeClassNames } from '@/utils/mergeClassNames';
import { useSidebarStore } from '@/stores/useSidebarStore';
import SidebarItem from './SidebarItem';
import { menuItems } from './constants';

export default function PrimarySidebar() {
  const { toggleSecondarySidebar, selectedMenu } = useSidebarStore();

  const topMenuItems = menuItems.slice(0, 3); // 처음 3개 (사람, 행성, 우주)
  const bottomMenuItems = menuItems.slice(3); // 나머지 3개 (알람, 설정, 헬프)

  return (
    <div
      className={mergeClassNames(
        'w-[64px] bg-gray-surface border-r border-gray-border',
        'py-3 flex flex-col justify-between items-center'
      )}
    >
      {/* 상단 섹션 */}
      <div className="flex flex-col gap-3">
        {topMenuItems.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            section="top"
            isSelected={selectedMenu === item.id}
            onClick={toggleSecondarySidebar}
          />
        ))}
      </div>

      {/* 하단 섹션 */}
      <div className="flex flex-col gap-3">
        {bottomMenuItems.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            section="bottom"
            isSelected={selectedMenu === item.id}
            onClick={toggleSecondarySidebar}
          />
        ))}
      </div>
    </div>
  );
}
