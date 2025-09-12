import { FiUserPlus } from 'react-icons/fi';
import { useState } from 'react';
import { useProfileStore } from '@/stores/useProfileStore';
import { useSignup } from '@/hooks/api/useAuth';
import { useSignupValidation } from '@/hooks/useSignupValidation';
import Iconframe from '@/components/common/Iconframe';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import PanelHeader from '../PanelHeader';
import type { SignupData } from '@/types/auth';

export default function SignUpPanel() {
  const { setProfilePanelMode } = useProfileStore();
  const [formData, setFormData] = useState<
    SignupData & { confirmPassword: string }
  >({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { errors, validateForm, handleInputChange } = useSignupValidation();

  const signupMutation = useSignup({
    email: formData.email,
    username: formData.username,
    password: formData.password,
  });

  const handleFormInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    handleInputChange(field as keyof typeof formData, value, formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    try {
      await signupMutation.mutateAsync();
      alert('회원가입이 완료되었습니다!');
      setProfilePanelMode('login');
    } catch (error: any) {
      console.error('회원가입 실패:', error);

      // 에러 메시지 처리
      if (error.response?.status === 409) {
        alert('이미 사용 중인 이메일 또는 사용자명입니다.');
      } else if (error.response?.status === 400) {
        alert('입력 정보를 다시 확인해주세요.');
      } else {
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <>
      <PanelHeader
        title="SIGN UP"
        showBackButton={true}
        onBack={() => setProfilePanelMode('login')}
      />
      <div className="text-center p-4">
        <div className="flex flex-col items-center mb-[24px]">
          <Iconframe color="secondary" size="medium" className="mb-[16px]">
            <FiUserPlus />
          </Iconframe>
          <h3 className="text-white font-semibold text-base">JOIN SONA</h3>
          <p className="text-text-muted text-sm">
            CREATE YOUR ACCOUNT TO
            <br />
            START COMPOSING
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-[24px] text-left gap-[16px]">
            <TextField label="Username" htmlFor="signup-username">
              <TextInput
                type="text"
                placeholder="Enter your username"
                id="signup-username"
                value={formData.username}
                onChange={(e) =>
                  handleFormInputChange('username', e.target.value)
                }
                className={errors.username ? 'border-error' : ''}
              />
              {errors.username && (
                <p className="text-error text-xs mt-1">{errors.username}</p>
              )}
            </TextField>

            <TextField label="Email" htmlFor="signup-email">
              <TextInput
                type="email"
                placeholder="Enter your email"
                id="signup-email"
                value={formData.email}
                onChange={(e) => handleFormInputChange('email', e.target.value)}
                className={errors.email ? 'border-error' : ''}
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </TextField>

            <TextField label="Password" htmlFor="signup-password">
              <TextInput
                type="password"
                placeholder="Enter your password"
                id="signup-password"
                value={formData.password}
                onChange={(e) =>
                  handleFormInputChange('password', e.target.value)
                }
                className={errors.password ? 'border-error' : ''}
              />
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password}</p>
              )}
            </TextField>

            <TextField
              label="Confirm Password"
              htmlFor="signup-confirm-password"
            >
              <TextInput
                type="password"
                placeholder="Confirm your password"
                id="signup-confirm-password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleFormInputChange('confirmPassword', e.target.value)
                }
                className={errors.confirmPassword ? 'border-error' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-error text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </TextField>
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full mt-[24px]"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? 'CREATING...' : 'CREATE ACCOUNT'}
          </Button>
        </form>

        <div className="flex flex-col items-center border-t border-gray-border pt-[24px] mt-[24px]">
          <p className="text-text-muted text-xs mb-[8px]">
            ALREADY HAVE AN ACCOUNT?
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setProfilePanelMode('login');
            }}
            className="text-secondary-300 text-sm font-semibold hover:text-secondary-200 transition-colors cursor-pointer"
          >
            SIGN IN
          </a>
        </div>
      </div>
    </>
  );
}
