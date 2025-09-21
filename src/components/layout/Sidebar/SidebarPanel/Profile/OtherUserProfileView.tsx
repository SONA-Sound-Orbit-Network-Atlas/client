import { FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';
import { useProfileStore } from '@/stores/useProfileStore';
import { useUserStore } from '@/stores/useUserStore';
import { navigateBack } from '@/utils/profileNavigation';
import { useGetUserProfile } from '@/hooks/api/useUser';
import {
  useGetFollowCount,
  useGetFollowings,
  useGetFollowers,
} from '@/hooks/api/useFollow';
import { useFollowActions } from '@/hooks/useFollowActions';
import ProfileStateWrapper from './ProfileStateWrapper';
import PanelHeader from '../PanelHeader';
import Iconframe from '@/components/common/Iconframe';
import StatCard from '@/components/common/Card/StatCard';
import Button from '@/components/common/Button';
import { ScrollArea } from '@/components/common/Scrollarea';

interface OtherUserProfileViewProps {
  userId: string;
}

export default function OtherUserProfileView({
  userId,
}: OtherUserProfileViewProps) {
  const { setProfilePanelMode, pushNavigationHistory } = useProfileStore();
  const { userStore } = useUserStore();

  // 다른 유저의 프로필 데이터 조회
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetUserProfile(userId.toString());

  // 다른 유저의 팔로우 통계 조회
  const {
    data: followStats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useGetFollowCount(userId.toString());

  // 현재 사용자의 팔로잉 목록 조회
  const {
    data: myFollowings,
    isLoading: isFollowingsLoading,
    error: followingsError,
  } = useGetFollowings({
    targetId: userStore.id,
    limit: 100,
  });

  // 상대방의 팔로워 목록 조회
  const {
    data: targetFollowers,
    isLoading: isFollowersLoading,
    error: followersError,
  } = useGetFollowers({
    targetId: userId,
    limit: 100,
  });

  // 팔로우 액션 훅
  const {
    handleFollow,
    handleUnfollow,
    getFollowerButtonState,
    isLoading: isActionLoading,
  } = useFollowActions();

  const isLoading =
    isProfileLoading ||
    isStatsLoading ||
    isFollowingsLoading ||
    isFollowersLoading;
  const error = profileError || statsError || followingsError || followersError;

  // 팔로우 관계 계산 - API 응답을 직접 사용
  const followRelation = (() => {
    if (!myFollowings || !targetFollowers) return null;

    // 내가 상대방을 팔로우하는지 확인
    const viewer_is_following = myFollowings.items.some(
      (user) => user.id === userId
    );

    // 상대방이 나를 팔로우하는지 확인 (팔로워 목록에서 현재 사용자 찾기)
    const viewer_is_followed_by = targetFollowers.items.some(
      (user) => user.id === userStore.id
    );

    const isMutual = viewer_is_following && viewer_is_followed_by;

    return {
      viewer_is_following,
      viewer_is_followed_by,
      isMutual,
    };
  })();

  // FollowListPanel과 동일한 로직으로 버튼 상태 결정
  const buttonState = followRelation
    ? getFollowerButtonState({
        id: userId,
        viewer_is_following: followRelation.viewer_is_following,
        viewer_is_followed_by: followRelation.viewer_is_followed_by,
        isMutual: followRelation.isMutual,
      })
    : null;

  const handleFollowersClick = () => {
    // 현재 상태를 히스토리에 저장
    pushNavigationHistory();
    setProfilePanelMode('otherUserFollowers');
  };

  const handleFollowingsClick = () => {
    // 현재 상태를 히스토리에 저장
    pushNavigationHistory();
    setProfilePanelMode('otherUserFollowings');
  };

  return (
    <ProfileStateWrapper
      isLoading={isLoading}
      error={error}
      profile={profile}
      title="PROFILE"
    >
      <PanelHeader
        title="PROFILE"
        showBackButton={true}
        onBack={navigateBack}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col">
            <div className="flex flex-col items-center border-b border-gray-border p-6">
              <div className="flex flex-col items-center">
                {profile?.image &&
                typeof profile.image === 'string' &&
                !profile.image.includes('defaults/avatar.png') ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-[16px] border-2 border-tertiary-300">
                    <img
                      src={profile.image}
                      alt={`${profile.username} profile image`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Iconframe
                    color="tertiary"
                    size="large"
                    className="mb-[16px]"
                  >
                    <FiUser />
                  </Iconframe>
                )}
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-base">
                    {profile?.username || 'Loading...'}
                  </h3>
                  {buttonState?.showMutualIcon && (
                    <FiUsers
                      className="w-4 h-4 text-primary-300"
                      title="MUTUAL FOLLOW"
                    />
                  )}
                </div>
                {profile?.about && (
                  <p className="text-text-muted text-sm text-center">
                    {profile.about}
                  </p>
                )}
                {/* 팔로우 버튼 - FollowListPanel과 동일한 로직 */}
                {buttonState && (
                  <Button
                    color={
                      buttonState.action === 'unfollow'
                        ? 'secondary'
                        : 'primary'
                    }
                    size="lg"
                    onClick={() => {
                      if (buttonState.action === 'unfollow') {
                        handleUnfollow(userId);
                      } else {
                        handleFollow(userId);
                      }
                    }}
                    disabled={isActionLoading}
                    className="mt-4 w-full"
                  >
                    {buttonState.text}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col p-6">
              <p className="text-tertiary-200 text-sm font-semibold mb-[16px]">
                STATISTICS
              </p>
              {/* 다른 유저 프로필에서는 Likes 섹션을 숨김 */}
              <div className="mb-[24px]">
                <p className="text-text-muted text-sm mb-[16px]">SOCIALS</p>
                <div className="flex flex-col gap-[12px] w-full">
                  <StatCard
                    icon={<FiUser className="text-primary-300" />}
                    value={followStats?.followersCount || 0}
                    label="FOLLOWERS"
                    onClick={handleFollowersClick}
                    className="hover:brightness-110 hover:bg-primary-300/20 border-primary-300/20 hover:text-primary-300 hover:[&_p]:text-primary-300 hover:[&_svg]:text-primary-300"
                  />
                  <StatCard
                    icon={<FiUserCheck className="text-secondary-300" />}
                    value={followStats?.followingsCount || 0}
                    label="FOLLOWINGS"
                    onClick={handleFollowingsClick}
                    className="hover:brightness-110 hover:bg-secondary-300/20 border-secondary-300/20 hover:text-secondary-300 hover:[&_p]:text-secondary-300 hover:[&_svg]:text-secondary-300"
                  />
                </div>
              </div>
              {/* <div className="mb-[24px]">
                <p className="text-text-muted text-sm mb-[16px]">
                  USER STELLAR SYSTEMS
                </p>
              </div> */}
            </div>
          </div>
        </ScrollArea>
      </div>
    </ProfileStateWrapper>
  );
}
