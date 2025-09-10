import {
  FiEdit3,
  FiUser,
  FiLogOut,
  FiHeart,
  FiUserCheck,
} from 'react-icons/fi';
import { IoPlanetOutline } from 'react-icons/io5';
import { useSidebarStore } from '@/stores/sidebarStore';
import Iconframe from '@/components/common/Iconframe';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card/Card';
import StatCard from '@/components/common/Card/StatCard';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function ProfileView() {
  const { setProfilePanelMode } = useSidebarStore();

  // 임시 데이터
  const profile = {
    username: '테스터',
    email: 'tester@example.com',
    joinDate: '2024-01-01',
    about: 'aboutaboutabout',
  };

  const handleLikesClick = () => {
    setProfilePanelMode('likes');
  };

  const handleFollowersClick = () => {
    setProfilePanelMode('followers');
  };

  const handleFollowingsClick = () => {
    setProfilePanelMode('followings');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col">
          <div className="flex flex-col items-center border-b border-gray-border p-6">
            <div className="flex flex-col items-center mb-[24px]">
              <Iconframe color="tertiary" size="large" className="mb-[16px]">
                <FiUser />
              </Iconframe>
              <h3 className="text-white font-semibold text-base">
                {profile.username}
              </h3>
              <p className="text-text-muted text-sm text-center">
                {profile.about}
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
        <Button color="tertiary" size="lg" className="w-full">
          <FiLogOut />
          SIGN OUT
        </Button>
      </div>
    </div>
  );
}
