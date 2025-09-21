import { FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useProfileStore } from '@/stores/useProfileStore';
import { useLoginForm } from '@/hooks/useLoginForm';
import Iconframe from '@/components/common/Iconframe';
import LoginForm from '@/components/forms/LoginForm';
import ErrorMessage from '@/components/common/ErrorMessage';
import { ScrollArea } from '@/components/common/Scrollarea';

export default function LoginPanel() {
  const { setProfilePanelMode } = useProfileStore();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const loginForm = useLoginForm({
    onSuccess: () => {
      console.log('로그인이 완료되었습니다!');
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
        setErrorMessage(`Login failed: ${apiError.message}`);
      } else if (error.response?.status === 401) {
        setErrorMessage('Email or password is incorrect');
      } else {
        setErrorMessage(
          'An error occurred while logging in. Please try again.'
        );
      }
    },
  });

  return (
    <ScrollArea className="h-full">
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
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        )}

        <LoginForm
          formData={loginForm.formData}
          errors={loginForm.errors}
          isLoading={loginForm.isLoading}
          onInputChange={loginForm.handleInputChange}
          onSubmit={loginForm.handleSubmit}
        />
        {/* <div className="flex justify-center mt-[24px] mb-[24px]">
          <a
            href="#"
            className="text-primary-300 text-xs hover:text-primary-200 transition-colors cursor-pointer"
          >
            FORGOT PASSWORD?
          </a>
        </div> */}
        <div className="flex flex-col items-center border-t border-gray-border mt-[24px] pt-[24px]">
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
    </ScrollArea>
  );
}
