import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';
import { FiX } from 'react-icons/fi';
import MenuContent from './MenuContent';
import { menuContents } from './constants';

export default function SecondarySidebar() {
  const { isSecondaryOpen, selectedMenu, closeSecondarySidebar } =
    useSidebarStore();

  if (!isSecondaryOpen || !selectedMenu) return null;

  const content = menuContents[selectedMenu];
  if (!content) return null;

  return (
    <div
      className={cn(
        'w-80 bg-gray-surface border-r border-gray-border',
        'p-4 flex flex-col gap-4'
      )}
    >
      {/* 헤더와 닫기 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white font-semibold text-lg">{content.title}</div>
        <button
          onClick={closeSecondarySidebar}
          className="p-2 hover:bg-gray-card rounded-lg transition-colors"
        >
          <FiX className="w-4 h-4 text-text-white" />
        </button>
      </div>

      {/* 메뉴 내용 */}
      <MenuContent content={content} />
    </div>
  );
}
