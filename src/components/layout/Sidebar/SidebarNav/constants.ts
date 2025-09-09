import { FiUser, FiBell, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { IoPlanetOutline, IoEarthSharp } from 'react-icons/io5';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const menuItems: MenuItem[] = [
  // 상단 섹션
  { id: 'profile', label: '프로필', icon: FiUser },
  { id: 'galaxy', label: '은하', icon: IoEarthSharp },
  { id: 'stellar', label: '스텔라시스템', icon: IoPlanetOutline },

  // 하단 섹션
  { id: 'alarm', label: '알람', icon: FiBell },
  { id: 'settings', label: '설정', icon: FiSettings },
  { id: 'help', label: '헬프', icon: FiHelpCircle },
];

export const sectionStyles = {
  top: {
    iconSize: 'w-5 h-5',
    iconColor: 'text-text-muted',
    hoverEffect: 'hover:text-tertiary-200',
    selectedStyle:
      'bg-tertiary-200-20 border border-tertiary-200-20 text-tertiary-200 hover:bg-tertiary-200-50',
  },
  bottom: {
    iconSize: 'w-5 h-5',
    iconColor: 'text-text-muted',
    hoverEffect: 'hover:text-text-secondary',
    selectedStyle: 'text-text-white',
  },
};
