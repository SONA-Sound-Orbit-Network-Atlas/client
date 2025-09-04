import { FiEdit3, FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import { useSidebarStore } from '@/stores/sidebarStore';
import Iconframe from '@/components/common/Iconframe';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import TextField from '@/components/common/textField';
import SignUpPanel from './SignUpPanel';

export default function ProfilePanel() {
  const { isLoggedIn, profilePanelMode, setProfilePanelMode } =
    useSidebarStore();

  // 임시 데이터
  const profile = {
    name: '사용자',
    email: 'user@example.com',
    joinDate: '2024-01-01',
  };

  return (
    <div className={`space-y-4 ${profilePanelMode === 'signup' ? '' : 'p-4'}`}>
      {isLoggedIn ? (
        // 로그인된 상태 - 프로필 화면
        <>
          {/* 프로필 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-tertiary-200 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {profile.name}
                </h3>
                <p className="text-text-muted text-sm">{profile.email}</p>
              </div>
            </div>
            <button className="p-2 text-text-muted hover:text-tertiary-200 transition-colors">
              <FiEdit3 className="w-4 h-4" />
            </button>
          </div>

          {/* 프로필 정보 */}
          <div className="space-y-3">
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="w-4 h-4 text-text-muted" />
                <span className="text-text-white text-sm font-medium">
                  이름
                </span>
              </div>
              <p className="text-text-white">{profile.name}</p>
            </div>
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiMail className="w-4 h-4 text-text-muted" />
                <span className="text-text-white text-sm font-medium">
                  이메일
                </span>
              </div>
              <p className="text-text-white">{profile.email}</p>
            </div>
            <div className="p-3 bg-gray-card rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="w-4 h-4 text-text-muted" />
                <span className="text-text-white text-sm font-medium">
                  가입일
                </span>
              </div>
              <p className="text-text-white">{profile.joinDate}</p>
            </div>
          </div>

          {/* 추가 액션 버튼들 */}
          <div className="pt-4 border-t border-gray-border">
            <div className="space-y-2">
              <button className="w-full p-3 text-left bg-gray-card hover:bg-gray-border rounded-lg transition-colors">
                <span className="text-text-white text-sm">계정 설정</span>
              </button>
              <button className="w-full p-3 text-left bg-gray-card hover:bg-gray-border rounded-lg transition-colors">
                <span className="text-text-white text-sm">프라이버시 설정</span>
              </button>
              <button className="w-full p-3 text-left bg-gray-card hover:bg-gray-border rounded-lg transition-colors">
                <span className="text-text-white text-sm">알림 설정</span>
              </button>
            </div>
          </div>
        </>
      ) : // 로그인 안된 상태 - 로그인/회원가입 화면
      profilePanelMode === 'signup' ? (
        <SignUpPanel />
      ) : (
        <div className="text-center">
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
