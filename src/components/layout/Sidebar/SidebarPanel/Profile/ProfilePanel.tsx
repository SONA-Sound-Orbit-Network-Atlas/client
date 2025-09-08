import {
  FiEdit3,
  FiUser,
  FiLogOut,
  FiChevronRight,
  FiHeart,
  FiUserCheck,
} from 'react-icons/fi';
import { IoPlanetOutline } from 'react-icons/io5';
import { useSidebarStore } from '@/stores/sidebarStore';
import Iconframe from '@/components/common/Iconframe';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import TextField from '@/components/common/textField';
import SignUpPanel from './SignUpPanel';
import Card from '@/components/common/Card';

export default function ProfilePanel() {
  const { isLoggedIn, profilePanelMode, setProfilePanelMode } =
    useSidebarStore();

  // 임시 데이터
  const profile = {
    username: '테스터',
    email: 'tester@example.com',
    joinDate: '2024-01-01',
    about: 'aboutaboutabout',
  };

  return (
    <div className={'h-full flex flex-col overflow-hidden'}>
      {isLoggedIn ? (
        // 로그인된 상태 - 프로필 화면
        <>
          <div className="flex flex-col h-full overflow-hidden">
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
              <Button color="secondary" size="lg" className="w-full">
                <FiEdit3 />
                EDIT PROFILE
              </Button>
            </div>
            <div className="flex flex-col p-6 flex-1">
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
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiHeart className="text-white text-lg mr-4" />
                      <div className="flex flex-col">
                        <p className="text-white text-lg font-semibold">85</p>
                        <p className="text-text-muted text-sm">MY LIKES</p>
                      </div>
                    </div>
                    <FiChevronRight className="text-text-muted text-lg" />
                  </div>
                </Card>
              </div>
              <div className="mb-[24px]">
                <p className="text-text-muted text-sm mb-[16px]">SOCIALS</p>
                <div className="flex flex-col gap-[12px] w-full">
                  <Card>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiUser className="text-primary-300 text-lg mr-4" />
                        <div className="flex flex-col">
                          <p className="text-white text-lg font-semibold">24</p>
                          <p className="text-text-muted text-sm">FOLLOWERS</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-text-muted text-lg" />
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiUserCheck className="text-secondary-300 text-lg mr-4" />
                        <div className="flex flex-col">
                          <p className="text-white text-lg font-semibold">18</p>
                          <p className="text-text-muted text-sm">FOLLOWINGS</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-text-muted text-lg" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-border">
              <Button color="tertiary" size="lg" className="w-full">
                <FiLogOut />
                SIGN OUT
              </Button>
            </div>
          </div>
        </>
      ) : // 로그인 안된 상태 - 로그인/회원가입 화면
      profilePanelMode === 'signup' ? (
        <SignUpPanel />
      ) : (
        <div className="text-center p-4">
          <div className="flex flex-col items-center mb-[24px]">
            <Iconframe color="primary" size="medium" className="mb-[16px]">
              <FiUser />
            </Iconframe>
            <h3 className="text-white font-semibold text-base">WELCOME BACK</h3>
            <p className="text-text-muted text-sm">
              SIGN IN TO CREATE AND
              <br />
              MANAGE SYSTEMS
            </p>
          </div>
          <div className="flex flex-col mt-[24px] text-left gap-[16px]">
            <TextField label="Email" htmlFor="email">
              <TextInput
                type="email"
                placeholder="Enter your email"
                id="email"
              />
            </TextField>
            <TextField label="Password" htmlFor="password">
              <TextInput
                type="password"
                placeholder="Enter your password"
                id="password"
              />
            </TextField>
          </div>
          <Button color="primary" size="lg" className="w-full mt-[24px]">
            SIGN IN
          </Button>
          <div className="flex justify-center mt-[24px] mb-[24px]">
            <a
              href="#"
              className="text-primary-300 text-xs hover:text-primary-200 transition-colors cursor-pointer"
            >
              FORGOT PASSWORD?
            </a>
          </div>
          <div className="flex flex-col items-center border-t border-gray-border pt-[24px]">
            <p className="text-text-muted text-xs mb-[8px]">
              DON'T HAVE AN ACCOUNT?
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setProfilePanelMode('signup');
              }}
              className="text-primary-300 text-sm font-semibold hover:text-primary-200 transition-colors cursor-pointer"
            >
              SIGN UP
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
