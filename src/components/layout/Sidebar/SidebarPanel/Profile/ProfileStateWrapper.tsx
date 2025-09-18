import type { ReactNode } from 'react';
import { navigateBack } from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import { ScrollArea } from '@/components/common/Scrollarea';
import LoadingIcon from '@/components/common/LoadingIcon';

interface ProfileStateWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  error: any;
  profile: any;
  title?: string;
}

export default function ProfileStateWrapper({
  children,
  isLoading,
  error,
  profile,
  title = 'PROFILE',
}: ProfileStateWrapperProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <>
        <PanelHeader
          title={title}
          showBackButton={true}
          onBack={navigateBack}
        />
        <div className="flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col items-center justify-center p-6 h-full">
              <LoadingIcon />
              <p className="text-text-muted text-sm mt-4">profile loading...</p>
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <>
        <PanelHeader
          title={title}
          showBackButton={true}
          onBack={navigateBack}
        />
        <div className="flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col items-center justify-center p-6 h-full">
              <p className="text-red-400 text-sm text-center">
                profile loading error...
              </p>
              <p className="text-text-muted text-xs text-center mt-2">
                please try again later.
              </p>
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }

  // 프로필 데이터가 없는 경우
  if (
    !profile ||
    (typeof profile === 'object' && Object.keys(profile).length === 0)
  ) {
    return (
      <>
        <PanelHeader
          title={title}
          showBackButton={true}
          onBack={navigateBack}
        />
        <div className="flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col items-center justify-center p-6 h-full">
              <p className="text-text-muted text-sm text-center">
                profile not found.
              </p>
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }

  // 정상 상태 - children 렌더링
  return <>{children}</>;
}
