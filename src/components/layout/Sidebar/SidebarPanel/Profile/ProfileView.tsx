import { FiEdit3, FiUser, FiLogOut, FiUserCheck } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { IoPlanetOutline } from 'react-icons/io5';
import { useProfileStore } from '@/stores/useProfileStore';
import { useLogout } from '@/hooks/api/useAuth';
import { useGetUserProfile } from '@/hooks/api/useUser';
import { useUserStore } from '@/stores/useUserStore';
import { useGetFollowers, useGetFollowings } from '@/hooks/api/useFollow';
import { useGetMyLikes } from '@/hooks/api/useLikes';
import { useGetStellarMyList } from '@/hooks/api/useGalaxy';
import ProfileStateWrapper from './ProfileStateWrapper';
import Iconframe from '@/components/common/Iconframe';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card/Card';
import StatCard from '@/components/common/Card/StatCard';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function ProfileView() {
  const { setProfilePanelMode } = useProfileStore();
  const logoutMutation = useLogout();
  const { userStore } = useUserStore();

  // 사용자 프로필 데이터 조회
  const {
    data: serverProfile,
    isLoading,
    error,
  } = useGetUserProfile(userStore.id);

  // 팔로워 수 조회
  const { data: followersData } = useGetFollowers({
    userId: userStore.id || '',
    page: 1,
    limit: 1, // 총 개수만 필요하므로 1개만 조회
  });

  // 팔로잉 수 조회
  const { data: followingsData } = useGetFollowings({
    userId: userStore.id || '',
    page: 1,
    limit: 1, // 총 개수만 필요하므로 1개만 조회
  });

  // 좋아요 개수 조회
  const { data: likesData, isLoading: likesLoading } = useGetMyLikes({
    page: 1,
    limit: 1,
  });

  // 내 스텔라 시스템 갯수 조회
  const { data: myStellarData, isLoading: myStellarLoading } =
    useGetStellarMyList({
      page: 1,
      limit: 1, // 갯수만 필요하므로 1개만 조회
    });

  // userStore 데이터를 우선적으로 사용하고, 서버 데이터가 있으면 병합
  const profile = userStore.id
    ? {
        ...serverProfile,
        username: userStore.username,
        about: userStore.about,
        email: userStore.email,
        // 서버에서 가져온 추가 데이터가 있으면 유지
        ...(serverProfile && {
          image: serverProfile.image,
          created_at: serverProfile.created_at,
          updated_at: serverProfile.updated_at,
        }),
      }
    : serverProfile;

  const handleLikesClick = () => {
    setProfilePanelMode('likes');
  };

  const handleFollowersClick = () => {
    setProfilePanelMode('followers');
  };

  const handleFollowingsClick = () => {
    setProfilePanelMode('followings');
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <ProfileStateWrapper isLoading={isLoading} error={error} profile={profile}>
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col">
            <div className="flex flex-col items-center border-b border-gray-border p-6">
              <div className="flex flex-col items-center mb-[24px]">
                {profile?.image &&
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
                  {profile?.username}
                </h3>
                <p className="text-text-muted text-sm text-center">
                  {profile?.about || '소개가 없습니다.'}
                </p>
              </div>
              <Button
                color="secondary"
                size="lg"
                className="w-full"
                onClick={() => setProfilePanelMode('editProfile')}
              >
                <FiEdit3 />
                EDIT PROFILE
              </Button>
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
                    {myStellarLoading ? 0 : (myStellarData?.totalCount ?? 0)}
                  </p>
                </Card>
              </div>
              <div className="mb-[24px]">
                <p className="text-text-muted text-sm mb-[16px]">LIKES</p>
                <StatCard
                  icon={<FaHeart className="text-text-white size-[16px]" />}
                  value={likesLoading ? 0 : likesData?.total || 0}
                  label="MY LIKES"
                  onClick={handleLikesClick}
                  className="w-full hover:brightness-110 hover:bg-text-white/20 border-white/20 hover:text-white hover:[&_p]:text-white hover:[&_svg]:text-white"
                />
              </div>
              <div className="mb-[24px]">
                <p className="text-text-muted text-sm mb-[16px]">SOCIALS</p>
                <div className="flex flex-col gap-[12px] w-full">
                  <StatCard
                    icon={<FiUser className="text-primary-300" />}
                    value={followersData?.meta?.total || 0}
                    label="FOLLOWERS"
                    onClick={handleFollowersClick}
                    className="hover:brightness-110 hover:bg-primary-300/20 border-primary-300/20 hover:text-primary-300 hover:[&_p]:text-primary-300 hover:[&_svg]:text-primary-300"
                  />
                  <StatCard
                    icon={<FiUserCheck className="text-secondary-300" />}
                    value={followingsData?.meta?.total || 0}
                    label="FOLLOWINGS"
                    onClick={handleFollowingsClick}
                    className="hover:brightness-110 hover:bg-secondary-300/20 border-secondary-300/20 hover:text-secondary-300 hover:[&_p]:text-secondary-300 hover:[&_svg]:text-secondary-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex-shrink-0 p-6 border-t border-gray-border">
          <Button
            color="tertiary"
            size="lg"
            className="w-full"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <FiLogOut />
            {logoutMutation.isPending ? 'SIGNING OUT...' : 'SIGN OUT'}
          </Button>
        </div>
      </div>
    </ProfileStateWrapper>
  );
}
