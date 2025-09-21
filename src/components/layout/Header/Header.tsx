import React from 'react';
import { mergeClassNames } from '@/utils/mergeClassNames';
import sonaLogo from '@/assets/sona_logo_header_cropped_250w.png';
import Button from '@/components/common/Button';
import { FiArrowLeft } from 'react-icons/fi';
import { useUserStore } from '@/stores/useUserStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import SaveButton from './SaveButton';
import { useNavigate } from 'react-router-dom';
import { AudioEngine } from '@/audio/core/AudioEngine';
import { StellarSystem } from '@/audio/core/StellarSystem';
import { useStellarStore } from '@/stores/useStellarStore';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Header({ className, children }: HeaderProps) {
  const navigate = useNavigate();
  const { mode, setIdle } = useSelectedStellarStore();
  const { userStore } = useUserStore();
  const { stellarStore } = useStellarStore();
  const isOwner = userStore.id === stellarStore.creator_id;
  const isEditMode = mode === 'view' && isOwner;

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
      <div
        className="flex items-center cursor-pointer"
        onClick={async () => {
          try {
            const engine = AudioEngine.instance;
            // 부드러운 페이드아웃을 시도
            await engine.fadeOutAndStop(0.8);
          } catch (err) {
            // 페이드 실패시에도 강제로 정지
            console.debug('Header: fadeOut failed', err);
          }

          try {
            // 모든 패턴 정지 및 dispose 보호 호출
            StellarSystem.instance.stopAllPatterns();
          } catch (err) {
            console.debug('Header: stopAllPatterns failed', err);
          }

          navigate('/');
        }}
      >
        <img
          src={sonaLogo}
          alt="SONA Logo"
          className="w-14 h-14 object-contain"
        />
      </div>

      {/* 중앙 네비게이션 영역 */}
      <nav className="flex-1 flex items-center justify-center">{children}</nav>

      {/* 우측 사용자 메뉴 영역 - 편집, 생성 모드일 때만 표시 */}
      {(mode === 'create' || isEditMode) && <SaveButton />}

      {/* BACK TO GALAXY 버튼 */}
      {mode !== 'idle' && (
        <Button
          className="ml-2"
          color="tertiary"
          size="sm"
          onClick={() => setIdle()}
        >
          <FiArrowLeft className="w-4 h-4" />
          BACK TO GALAXY
        </Button>
      )}
    </header>
  );
}
