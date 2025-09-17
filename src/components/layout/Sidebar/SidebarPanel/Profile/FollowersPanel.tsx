import {
  navigateToOtherUserProfile,
  navigateBack,
} from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import UserCard from '@/components/common/Card/UserCard';
import { ScrollArea } from '@/components/common/Scrollarea';
import {
  useCreateFollow,
  useGetFollowers,
  useDeleteFollow,
} from '@/hooks/api/useFollow';
import { useUserStore } from '@/stores/useUserStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useState, useEffect } from 'react';
import type { FollowerUser } from '@/types/follow';

export default function FollowersPanel() {
  const createFollowMutation = useCreateFollow();
  const deleteFollowMutation = useDeleteFollow();
  const { userStore } = useUserStore();
  const { profilePanelMode, viewingUserId } = useProfileStore();

  // Load More를 위한 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [allFollowers, setAllFollowers] = useState<FollowerUser[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 팔로우 상태를 위한 로컬 상태 관리
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [mutualFollows, setMutualFollows] = useState<Set<string>>(new Set());

  // 중복 제거 유틸리티 함수
  const removeDuplicates = (followers: FollowerUser[]): FollowerUser[] => {
    const seen = new Set<string>();
    return followers.filter((follower) => {
      if (seen.has(follower.id)) {
        return false;
      }
      seen.add(follower.id);
      return true;
    });
  };

  // 패널 모드에 따라 다른 사용자 ID 사용
  const targetUserId =
    profilePanelMode === 'followers'
      ? userStore.id // 내 팔로워
      : viewingUserId
        ? `cmf_user_${viewingUserId}`
        : null; // 다른 사용자 팔로워

  // 실제 API를 사용하여 팔로워 목록 조회
  const {
    data: followersData,
    isLoading,
    error,
  } = useGetFollowers({
    userId: targetUserId || '',
    page: currentPage,
    limit: 20,
  });

  // 사용자 ID 변경 시 상태 초기화
  useEffect(() => {
    setCurrentPage(1);
    setAllFollowers([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setFollowedUsers(new Set());
    setMutualFollows(new Set());
  }, [targetUserId]);

  // 데이터 누적 로직
  useEffect(() => {
    if (followersData?.meta && followersData?.items) {
      if (currentPage === 1) {
        // 첫 페이지: 기존 데이터 초기화 (중복 제거)
        const uniqueFollowers = removeDuplicates(followersData.items);
        setAllFollowers(uniqueFollowers);
      } else {
        // 추가 페이지: 기존 데이터에 추가 (중복 제거)
        setAllFollowers((prev) => {
          const combined = [...prev, ...followersData.items];
          const uniqueFollowers = removeDuplicates(combined);
          return uniqueFollowers;
        });
      }

      // 더 불러올 데이터가 있는지 확인
      const totalPages = Math.ceil(
        followersData.meta.total / followersData.meta.limit
      );
      const hasMoreData = currentPage < totalPages;

      setHasMore(hasMoreData);
      setIsLoadingMore(false);
    }
  }, [followersData, currentPage]);

  const handleFollow = (userId: string) => {
    createFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 로컬 상태 업데이트: 팔로우한 사용자를 followedUsers에 추가
          setFollowedUsers((prev) => new Set(prev).add(userId));
          // 맞팔로우 상태로 업데이트
          setMutualFollows((prev) => new Set(prev).add(userId));
        },
        onError: (error) => {
          console.error('팔로우 실패:', error);
          // TODO: 토스트 메시지로 사용자에게 에러 알림
        },
      }
    );
  };

  const handleUnfollow = (userId: string) => {
    deleteFollowMutation.mutate(
      { targetUserId: userId },
      {
        onSuccess: () => {
          // 로컬 상태 업데이트: 언팔로우한 사용자를 제거
          setFollowedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
          setMutualFollows((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        },
        onError: (error) => {
          console.error('팔로우 실패:', error);
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
              FOLLOWERS ({followersData?.meta?.total || 0})
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
                    isFollowing={
                      followedUsers.has(follower.id) || follower.isMutual
                    }
                    isMutualFollow={
                      mutualFollows.has(follower.id) || follower.isMutual
                    }
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    onClick={handleUserClick}
                    isLoading={
                      createFollowMutation.isPending ||
                      deleteFollowMutation.isPending
                    }
                  />
                ))}
              </div>
            )}

            {/* Load More 버튼 */}
            {hasMore && !error && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {isLoadingMore ? '로딩 중...' : '더 보기'}
                </button>
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
