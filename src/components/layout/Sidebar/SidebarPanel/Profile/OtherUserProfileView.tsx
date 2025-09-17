import { FiUser, FiUserCheck } from 'react-icons/fi';
import { IoPlanetOutline } from 'react-icons/io5';
import { useProfileStore } from '@/stores/useProfileStore';
import { navigateBack } from '@/utils/profileNavigation';
import { useGetUserProfile } from '@/hooks/api/useUser';
import { useGetFollowCount } from '@/hooks/api/useFollow';
import ProfileStateWrapper from './ProfileStateWrapper';
import PanelHeader from '../PanelHeader';
import Iconframe from '@/components/common/Iconframe';
import Card from '@/components/common/Card/Card';
import StatCard from '@/components/common/Card/StatCard';
import { ScrollArea } from '@/components/common/Scrollarea';

interface OtherUserProfileViewProps {
  userId: string;
}

export default function OtherUserProfileView({
  userId,
}: OtherUserProfileViewProps) {
  const { setProfilePanelMode } = useProfileStore();

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

  const isLoading = isProfileLoading || isStatsLoading;
  const error = profileError || statsError;

  const handleFollowersClick = () => {
    setProfilePanelMode('otherUserFollowers');
  };

  const handleFollowingsClick = () => {
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
              <div className="flex flex-col items-center mb-[24px]">
                {profile?.image &&
                typeof profile.image === 'string' &&
                !profile.image.includes('defaults/avatar.png') ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-[16px] border-2 border-tertiary-300">
                    <img
                      src={profile.image}
                      alt={`${profile.username}의 프로필 이미지`}
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
                <h3 className="text-white font-semibold text-base">
                  {profile?.username || 'Loading...'}
                </h3>
                {profile?.about && (
                  <p className="text-text-muted text-sm text-center">
                    {profile.about}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col p-6">
              <p className="text-tertiary-200 text-sm font-semibold mb-[16px]">
                STATISTICS
              </p>
              <div className="mb-[24px]">
                <p className="text-text-muted text-sm mb-[16px]">
                  STELLAR SYSTEMS
                </p>
                <Card>
                  <div className="flex items-center justify-center gap-2 mb-[16px]">
                    <IoPlanetOutline className="text-tertiary-300 text-lg" />
                    <p className="text-text-muted text-sm">CREATED</p>
                  </div>
                  <p className="text-white text-center text-[24px] font-semibold">
                    3
                  </p>
                </Card>
              </div>
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
            </div>
          </div>
        </ScrollArea>
      </div>
    </ProfileStateWrapper>
  );
}
