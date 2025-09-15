import {
  FiEdit3,
  FiUser,
  FiLogOut,
  FiHeart,
  FiUserCheck,
} from 'react-icons/fi';
import { IoPlanetOutline } from 'react-icons/io5';
import { useProfileStore } from '@/stores/useProfileStore';
import { useLogout } from '@/hooks/api/useAuth';
import { useGetUserProfile } from '@/hooks/api/useUser';
import { useUserStore } from '@/stores/useUserStore';
import Iconframe from '@/components/common/Iconframe';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card/Card';
import StatCard from '@/components/common/Card/StatCard';
import { ScrollArea } from '@/components/common/Scrollarea';
import LoadingIcon from '@/components/common/LoadingIcon';

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

  // 로딩 상태
  if (isLoading) {
    return (
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
    );
  }

  // 에러 상태
  if (error) {
    return (
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
    );
  }

  // 프로필 데이터가 없는 경우
  if (!profile) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col items-center justify-center p-6 h-full">
            <p className="text-text-muted text-sm text-center">
              프로필 정보를 찾을 수 없습니다.
            </p>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col">
          <div className="flex flex-col items-center border-b border-gray-border p-6">
            <div className="flex flex-col items-center mb-[24px]">
              {profile.image &&
              !profile.image.includes('defaults/avatar.png') ? (
                <div className="w-16 h-16 rounded-full overflow-hidden mb-[16px] border-2 border-tertiary-300">
                  <img
                    src={profile.image}
                    alt={`${profile.username}의 프로필 이미지`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Iconframe color="tertiary" size="large" className="mb-[16px]">
                  <FiUser />
                </Iconframe>
              )}
              <h3 className="text-white font-semibold text-base">
                {profile.username}
              </h3>
              <p className="text-text-muted text-sm text-center">
                {profile.about || '소개가 없습니다.'}
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
                  3
                </p>
              </Card>
            </div>
            <div className="mb-[24px]">
              <p className="text-text-muted text-sm mb-[16px]">LIKES</p>
              <StatCard
                icon={<FiHeart className="text-white" />}
                value={85}
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
                  value={24}
                  label="FOLLOWERS"
                  onClick={handleFollowersClick}
                  className="hover:brightness-110 hover:bg-primary-300/20 border-primary-300/20 hover:text-primary-300 hover:[&_p]:text-primary-300 hover:[&_svg]:text-primary-300"
                />
                <StatCard
                  icon={<FiUserCheck className="text-secondary-300" />}
                  value={18}
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
  );
}
