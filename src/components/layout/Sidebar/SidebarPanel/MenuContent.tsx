import type { MenuContent as MenuContentType } from './constants';
import ProfilePanel from './Profile/ProfilePanel';
import GalaxyIndex from '@/components/panel/galaxy/GalaxyIndex';

interface MenuContentProps {
  content: MenuContentType;
  menuId: string;
}

export default function MenuContent({ content, menuId }: MenuContentProps) {
  // 메뉴별로 다른 컴포넌트 렌더링
  const renderMenuContent = () => {
    switch (menuId) {
      case 'profile':
        return <ProfilePanel />;
      case 'galaxy':
        return (
          <div className="w-full">
            <GalaxyIndex />
          </div>
        );
      case 'system':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="text-text-white text-sm font-medium">
                {content.title}
              </div>
            </div>
          </div>
        );
      case 'alarm':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="text-text-white text-sm font-medium">
                {content.title}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="text-text-white text-sm font-medium">
                {content.title}
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="text-text-white text-sm font-medium">
                {content.title}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="text-text-white text-sm font-medium">
                {content.title}
              </div>
            </div>
          </div>
        );
    }
  };

  return <>{renderMenuContent()}</>;
}
