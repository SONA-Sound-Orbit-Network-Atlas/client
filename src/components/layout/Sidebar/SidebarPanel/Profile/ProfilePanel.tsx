// ProfilePanel.tsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import axios from 'axios';

import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';

import LoginPanel from './LoginPanel';
import SignUpPanel from './SignUpPanel';
import ProfileView from './ProfileView';
import OtherUserProfileView from './OtherUserProfileView';
import EditProfilePanel from './EditProfilePanel';
import LikesPanel from './LikesPanel';
import FollowersPanel from './FollowersPanel';
import FollowingsPanel from './FollowingsPanel';

// 1) 에러 fallback 컴포넌트
function ProfileErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  // 401 등 인증 관련
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    return (
      <div className="h-full flex flex-col">
        {/* 로그인 유도 UI로 바로 분기 */}
        <LoginPanel />
        <button className="mt-4 self-start" onClick={resetErrorBoundary}>
          다시 시도
        </button>
      </div>
    );
  }

  // 그 외 일반 에러
  return (
    <div className="p-4">
      <p className="font-semibold">프로필 패널 로딩 중 오류가 발생했습니다.</p>
      <pre className="mt-2 text-xs opacity-70 overflow-auto max-h-40">
        {String(error)}
      </pre>
      <button className="mt-4" onClick={resetErrorBoundary}>
        다시 시도
      </button>
    </div>
  );
}

// 2) 로딩 fallback (Suspense용)
function ProfileSkeleton() {
  return <div className="p-4">프로필 패널을 불러오는 중…</div>;
}

export default function ProfilePanel() {
  const { isLoggedIn } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();
  const { reset } = useQueryErrorResetBoundary(); // ErrorBoundary가 reset될 때 쿼리 에러도 함께 리셋

  const renderContent = () => {
    if (!isLoggedIn) {
      switch (profilePanelMode) {
        case 'signup':
          return <SignUpPanel />;
        default:
          return <LoginPanel />;
      }
    }

    switch (profilePanelMode) {
      case 'otherUserProfile':
        return viewingUserId ? (
          <OtherUserProfileView userId={viewingUserId} />
        ) : (
          <ProfileView />
        );
      case 'otherUserFollowers':
        return <FollowersPanel />;
      case 'otherUserFollowings':
        return <FollowingsPanel />;
      case 'editProfile':
        return <EditProfilePanel />;
      case 'likes':
        return <LikesPanel />;
      case 'followers':
        return <FollowersPanel />;
      case 'followings':
        return <FollowingsPanel />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <ErrorBoundary
      // 라우트/모드/대상 변경 시 에러 경계 리셋
      resetKeys={[isLoggedIn, profilePanelMode, viewingUserId]}
      onReset={reset} // React Query 쪽 에러 상태도 함께 초기화
      fallbackRender={ProfileErrorFallback}
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <div className="h-full flex flex-col overflow-hidden">
          {renderContent()}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
