import {
  navigateToOtherUserProfile,
  navigateBack,
} from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';
import Button from '@/components/common/Button';
import { useDeleteFollow, useGetFollowings } from '@/hooks/api/useFollow';
import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useState, useEffect } from 'react';
import type { FollowingUser } from '@/types/follow';

export default function FollowingsPanel() {
  const deleteFollowMutation = useDeleteFollow();
  const { userStore } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();

  // Load More를 위한 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [allFollowings, setAllFollowings] = useState<FollowingUser[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 언팔로우 상태를 위한 로컬 상태 관리
  const [unfollowedUsers, setUnfollowedUsers] = useState<Set<string>>(
    new Set()
  );

  // 중복 제거 유틸리티 함수
  const removeDuplicates = (followings: FollowingUser[]): FollowingUser[] => {
    const seen = new Set<string>();
    return followings.filter((following) => {
      if (seen.has(following.id)) {
        return false;
      }
      seen.add(following.id);
      return true;
    });
  };

  // 패널 모드에 따라 다른 사용자 ID 사용
  const targetUserId =
    profilePanelMode === 'followings'
      ? userStore.id // 내 팔로잉
      : viewingUserId
        ? `cmf_user_${viewingUserId}`
        : null; // 다른 사용자 팔로잉

  // 실제 API를 사용하여 팔로잉 목록 조회
  const {
    data: followingsData,
    isLoading,
    error,
  } = useGetFollowings({
    userId: targetUserId || '',
    page: currentPage,
    limit: 20,
  });

  // 사용자 ID 변경 시 상태 초기화
  useEffect(() => {
    setCurrentPage(1);
    setAllFollowings([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setUnfollowedUsers(new Set());
  }, [targetUserId]);

  // 데이터 누적 로직
  useEffect(() => {
    if (followingsData?.meta && followingsData?.items) {
      if (currentPage === 1) {
        // 첫 페이지: 기존 데이터 초기화 (중복 제거)
        const uniqueFollowings = removeDuplicates(followingsData.items);
        setAllFollowings(uniqueFollowings);
      } else {
        // 추가 페이지: 기존 데이터에 추가 (중복 제거)
        setAllFollowings((prev) => {
          const combined = [...prev, ...followingsData.items];
          const uniqueFollowings = removeDuplicates(combined);
          return uniqueFollowings;
        });
      }

      // 더 불러올 데이터가 있는지 확인
      const totalPages = Math.ceil(
        followingsData.meta.total / followingsData.meta.limit
      );
      const hasMoreData = currentPage < totalPages;

      setHasMore(hasMoreData);
      setIsLoadingMore(false);
    }
  }, [followingsData, currentPage]);

  const handleUnfollow = (userId: string) => {
    deleteFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 로컬 상태 업데이트: 언팔로우한 사용자를 unfollowedUsers에 추가
          setUnfollowedUsers((prev) => new Set(prev).add(userId));
        },
        onError: (error) => {
          console.error('언팔로우 실패:', error);
          // TODO: 토스트 메시지로 사용자에게 에러 알림
        },
      }
    );
  };

  const handleUserClick = (userId: string) => {
    // userId에서 숫자 부분만 추출하여 navigateToOtherUserProfile에 전달
    const numericId = parseInt(userId.replace('cmf_user_', ''));
    navigateToOtherUserProfile(numericId);
  };

  // Load More 핸들러
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && !error) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  // targetUserId가 없으면 로딩 상태 표시
  if (!targetUserId) {
    return (
      <>
        <PanelHeader
          title="FOLLOWINGS"
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
        title="FOLLOWINGS"
        showBackButton={true}
        onBack={navigateBack}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              FOLLOWINGS ({followingsData?.meta?.total || 0})
            </p>

            {isLoading && (
              <div className="text-center py-4">
                <p className="text-text-muted">로딩 중...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <p className="text-red-400">
                  팔로잉 목록을 불러오는데 실패했습니다.
                </p>
              </div>
            )}

            {!isLoading && !error && allFollowings.length > 0 && (
              <div className="space-y-3">
                {allFollowings.map((following) => (
                  <UserCard
                    key={following.id}
                    id={following.id}
                    username={following.username}
                    isFollowing={!unfollowedUsers.has(following.id)} // 언팔로우하지 않은 경우에만 true
                    isMutualFollow={
                      following.isMutual && !unfollowedUsers.has(following.id)
                    }
                    onFollow={undefined} // 팔로잉 패널에서는 팔로우 기능 없음
                    onUnfollow={handleUnfollow}
                    onClick={handleUserClick}
                    isLoading={deleteFollowMutation.isPending}
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
            {!hasMore && allFollowings.length > 0 && (
              <div className="text-center mt-6">
                <p className="text-text-muted text-sm">
                  모든 팔로잉을 불러왔습니다
                </p>
              </div>
            )}

            {!isLoading && !error && allFollowings.length === 0 && (
              <div className="text-center py-4">
                <p className="text-text-muted">팔로잉이 없습니다.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
