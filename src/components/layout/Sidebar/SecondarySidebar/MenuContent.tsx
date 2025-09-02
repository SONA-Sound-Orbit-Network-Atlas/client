import React from 'react';
import { cn } from '@/lib/utils';
import type { MenuContent as MenuContentType } from './constants';

interface MenuContentProps {
  content: MenuContentType;
}

export default function MenuContent({ content }: MenuContentProps) {
  return (
    <>
      {/* 헤더 */}
      <div className="text-white font-semibold text-lg mb-4">
        {content.title}
      </div>

      {/* 메뉴별 세부 옵션들 */}
      <div className="space-y-3">
        {content.items.map((item, index) => (
          <div key={index} className="p-3 bg-gray-card rounded-lg">
            <div className="text-text-white text-sm font-medium mb-2">
              {item.title}
            </div>
            <div className="text-text-muted text-xs">{item.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}
