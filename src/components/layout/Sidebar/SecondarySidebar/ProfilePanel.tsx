import { FiEdit3, FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import { useSidebarStore } from '@/stores/sidebarStore';

export default function ProfilePanel() {
  const { isLoggedIn } = useSidebarStore();

  // 임시 데이터
  const profile = {
    name: '사용자',
    email: 'user@example.com',
    joinDate: '2024-01-01',
  };

  return (
    <div className="space-y-4">
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
      ) : (
        // 로그인 안된 상태 - 로그인/회원가입 화면
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-card rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            로그인이 필요합니다
          </h3>
          <p className="text-text-muted text-sm mb-6">
            계정에 로그인하여 프로필을 확인하세요
          </p>
          <div className="space-y-3">
            <button className="w-full p-3 bg-tertiary-200 text-white rounded-lg hover:bg-tertiary-200-80 transition-colors">
              로그인
            </button>
            <button className="w-full p-3 bg-gray-card text-text-white rounded-lg hover:bg-gray-border transition-colors">
              회원가입
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
