import { FiUser } from 'react-icons/fi';
import { AxiosError } from 'axios';
import { useProfileStore } from '@/stores/useProfileStore';
import { useLoginForm } from '@/hooks/useLoginForm';
import Iconframe from '@/components/common/Iconframe';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPanel() {
  const { setProfilePanelMode } = useProfileStore();

  const loginForm = useLoginForm({
    onSuccess: () => {
      alert('로그인이 완료되었습니다!');
      setProfilePanelMode('profile');
    },
    onError: (error: AxiosError) => {
      // API 에러 메시지 처리
      if (
        error.response?.data &&
        typeof error.response.data === 'object' &&
        'error' in error.response.data
      ) {
        const apiError = (error.response.data as any).error;
        alert(`로그인 실패: ${apiError.message}`);
      } else if (error.response?.status === 401) {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  });

  return (
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

      <LoginForm
        formData={loginForm.formData}
        errors={loginForm.errors}
        isLoading={loginForm.isLoading}
        onInputChange={loginForm.handleInputChange}
        onSubmit={loginForm.handleSubmit}
      />
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
  );
}
