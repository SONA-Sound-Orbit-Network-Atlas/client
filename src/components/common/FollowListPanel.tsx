import { useEffect } from 'react';
import {
  navigateToOtherUserProfile,
  navigateBack,
} from '@/utils/profileNavigation';
import { getFollowPanelConfig } from '@/utils/followPanelConfig';
import PanelHeader from '@/components/layout/Sidebar/SidebarPanel/PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';
import Button from '@/components/common/Button';
import { useFollowList } from '@/hooks/useFollowList';
import { useFollowActions } from '@/hooks/useFollowActions';
import { userUtils } from '@/constants/user';
import type {
  FollowerUser,
  FollowingUser,
  FollowListPanelProps,
} from '@/types/follow';

export default function FollowListPanel({
  type,
  targetUserId,
  onBack = navigateBack,
}: FollowListPanelProps) {
  // 팔로우 액션 훅
  const {
    handleFollow,
    handleUnfollow,
    isFollowing,
    isMutualFollow,
    isStillFollowing,
    isStillMutualFollow,
    resetStates,
    isLoading: isActionLoading,
  } = useFollowActions();

  // 팔로우 리스트 훅
  const {
    allUsers,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    loadMore,
    totalCount,
  } = useFollowList<FollowerUser | FollowingUser>(type, {
    userId: targetUserId || '',
    limit: 20,
  });

  // 사용자 ID 변경 시 상태 초기화
  useEffect(() => {
    resetStates();
  }, [targetUserId, resetStates]);

  // 사용자 클릭 핸들러
  const handleUserClick = (userId: string) => {
    const numericId = userUtils.extractNumericId(userId);
    navigateToOtherUserProfile(numericId);
  };

  // 현재 타입에 맞는 설정 가져오기
  const config = getFollowPanelConfig(type);

  // targetUserId가 없으면 로딩 상태 표시
  if (!targetUserId) {
    return (
      <>
        <PanelHeader
          title={config.title}
          showBackButton={true}
          onBack={onBack}
        />
        <div className="flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              <div className="text-center py-4">
                <p className="text-text-muted">사용자 정보를 불러오는 중...</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }

  return (
    <>
      <PanelHeader title={config.title} showBackButton={true} onBack={onBack} />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              {config.title} ({totalCount})
            </p>

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="text-center py-4">
                <p className="text-text-muted">로딩 중...</p>
              </div>
            )}

            {/* 에러 상태 */}
            {error && (
              <div className="text-center py-4">
                <p className="text-red-400">{config.errorMessage}</p>
              </div>
            )}

            {/* 사용자 리스트 */}
            {!isLoading && !error && allUsers.length > 0 && (
              <div className="space-y-3">
                {allUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    id={user.id}
                    username={user.username}
                    isFollowing={
                      type === 'followers'
                        ? isFollowing(user.id, user.isMutual)
                        : isStillFollowing(user.id)
                    }
                    isMutualFollow={
                      type === 'followers'
                        ? isMutualFollow(user.id, user.isMutual)
                        : isStillMutualFollow(user.id, user.isMutual)
                    }
                    onFollow={type === 'followers' ? handleFollow : undefined}
                    onUnfollow={handleUnfollow}
                    onClick={handleUserClick}
                    isLoading={isActionLoading}
                  />
                ))}
              </div>
            )}

            {/* Load More 버튼 */}
            {hasMore && !error && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  color="tertiary"
                  className="w-full"
                >
                  {isLoadingMore ? '로딩 중...' : '더 보기'}
                </Button>
              </div>
            )}

            {/* 모든 데이터 로드 완료 메시지 */}
            {!hasMore && allUsers.length > 0 && (
              <div className="text-center mt-6">
                <p className="text-text-muted text-sm">
                  {config.loadCompleteMessage}
                </p>
              </div>
            )}

            {/* 빈 상태 */}
            {!isLoading && !error && allUsers.length === 0 && (
              <div className="text-center py-4">
                <p className="text-text-muted">{config.emptyMessage}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
