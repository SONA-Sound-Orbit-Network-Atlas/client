import React from 'react';
import { cn } from '@/lib/utils';
import sonaLogo from '@/assets/sona_logo_header_cropped_250w.png';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Header({ className, children }: HeaderProps) {
  return (
    <header
      className={cn(
        'w-full bg-gray-surface/80 border-b border-gray-border',
        'h-16 px-6 flex items-center justify-between',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* 좌측 로고 영역 */}
      <div className="flex items-center">
        <img
          src={sonaLogo}
          alt="SONA Logo"
          className="w-14 h-14 object-contain"
        />
      </div>

      {/* 중앙 네비게이션 영역 */}
      <nav className="flex-1 flex items-center justify-center">{children}</nav>

      {/* 우측 사용자 메뉴 영역 */}
      <div className="flex items-center gap-3">
        {/* 사용자 메뉴 버튼 등이 들어갈 자리 */}
      </div>
    </header>
  );
}
