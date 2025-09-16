import { ReactNode } from 'react';
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
              <p className="text-text-muted text-sm mt-4">
                프로필을 불러오는 중...
              </p>
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
                프로필을 불러올 수 없습니다.
              </p>
              <p className="text-text-muted text-xs text-center mt-2">
                잠시 후 다시 시도해주세요.
              </p>
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }

  // 프로필 데이터가 없는 경우
  if (!profile) {
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
                프로필 정보를 찾을 수 없습니다.
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
