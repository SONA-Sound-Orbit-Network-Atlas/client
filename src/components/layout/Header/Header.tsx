import React from 'react';
import { mergeClassNames } from '@/utils/mergeClassNames';
import sonaLogo from '@/assets/sona_logo_header_cropped_250w.png';
import Button from '@/components/common/Button';
import { FiArrowLeft } from 'react-icons/fi';
import { useUserStore } from '@/stores/useUserStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import SaveButton from './SavaButton';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Header({ className, children }: HeaderProps) {
  const { isLoggedIn } = useUserStore();
  const { setIdle } = useSelectedStellarStore();
  return (
    <header
      className={mergeClassNames(
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

      {/* 우측 사용자 메뉴 영역 - 로그인 상태일 때만 표시 */}
      {isLoggedIn && (
        <div className="flex items-center gap-3">
          {/* 항성계 정보 텍스트 => 기획에서 제거됨 */}
          {/* <div className="text-right mr-2">
            <div className="text-white text-[14px] font-medium leading-tight">
              항성계 이름
            </div>
            <div className="text-text-muted text-[12px] leading-tight">
              by {userStore.username || '제작자명'}
            </div>
          </div> */}

          <SaveButton />

          {/* BACK TO GALAXY 버튼 */}
          <Button color="tertiary" size="sm" onClick={() => setIdle()}>
            <FiArrowLeft className="w-4 h-4" />
            BACK TO GALAXY
          </Button>
        </div>
      )}
    </header>
  );
}
