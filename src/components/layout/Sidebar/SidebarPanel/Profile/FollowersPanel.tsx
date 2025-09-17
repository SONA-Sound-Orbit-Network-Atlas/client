import {
  navigateToOtherUserProfile,
  navigateBack,
} from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';
import Button from '@/components/common/Button';
import { useFollowersList } from '@/hooks/useFollowList';
import { useFollowActions } from '@/hooks/useFollowActions';
import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useState, useEffect } from 'react';

export default function FollowersPanel() {
  const { userStore } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);

  // 팔로우 액션 훅
  const {
    handleFollow,
    handleUnfollow,
    isFollowing,
    isMutualFollow,
    resetStates,
    isLoading: isActionLoading,
  } = useFollowActions();

  // 패널 모드에 따라 다른 사용자 ID 사용
  const targetUserId =
    profilePanelMode === 'followers'
      ? userStore.id // 내 팔로워
      : viewingUserId
        ? `cmf_user_${viewingUserId}`
        : null; // 다른 사용자 팔로워

  // 팔로워 리스트 훅
  const {
    allFollowers,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    loadMore,
    totalCount,
  } = useFollowersList({
    userId: targetUserId || '',
    page: currentPage,
    limit: 20,
  });

  // 사용자 ID 변경 시 상태 초기화
  useEffect(() => {
    setCurrentPage(1);
    resetStates();
  }, [targetUserId]);

  // Load More 핸들러
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && !error) {
      loadMore();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleUserClick = (userId: string) => {
    // userId에서 숫자 부분만 추출하여 navigateToOtherUserProfile에 전달
    const numericId = parseInt(userId.replace('cmf_user_', ''));
    navigateToOtherUserProfile(numericId);
  };

  // targetUserId가 없으면 로딩 상태 표시
  if (!targetUserId) {
    return (
      <>
        <PanelHeader
          title="FOLLOWERS"
          showBackButton={true}
          onBack={navigateBack}
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
      <PanelHeader
        title="FOLLOWERS"
        showBackButton={true}
        onBack={navigateBack}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              FOLLOWERS ({totalCount})
            </p>

            {isLoading && (
              <div className="text-center py-4">
                <p className="text-text-muted">로딩 중...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <p className="text-red-400">
                  팔로워 목록을 불러오는데 실패했습니다.
                </p>
              </div>
            )}

            {!isLoading && !error && allFollowers.length > 0 && (
              <div className="space-y-3">
                {allFollowers.map((follower) => (
                  <UserCard
                    key={follower.id}
                    id={follower.id}
                    username={follower.username}
                    isFollowing={isFollowing(follower.id, follower.isMutual)}
                    isMutualFollow={isMutualFollow(
                      follower.id,
                      follower.isMutual
                    )}
                    onFollow={handleFollow}
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
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  color="tertiary"
                  className="w-full"
                >
                  {isLoadingMore ? '로딩 중...' : '더 보기'}
                </Button>
              </div>
            )}

            {/* 모든 데이터 로드 완료 메시지 */}
            {!hasMore && allFollowers.length > 0 && (
              <div className="text-center mt-6">
                <p className="text-text-muted text-sm">
                  모든 팔로워를 불러왔습니다
                </p>
              </div>
            )}

            {!isLoading && !error && allFollowers.length === 0 && (
              <div className="text-center py-4">
                <p className="text-text-muted">팔로워가 없습니다.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
