import { useState } from 'react';
import { AxiosError } from 'axios';
import { useUpdatePassword } from '@/hooks/api/useUser';
import { validatePassword } from '@/utils/validation';

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UseChangePasswordOptions {
  onSuccess?: () => void;
}

export function useChangePassword(options?: UseChangePasswordOptions) {
  const updatePasswordMutation = useUpdatePassword();

  // 폼 상태 관리
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  // 폼 검증
  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setError('현재 비밀번호를 입력해주세요.');
      return false;
    }

    // 새 비밀번호 검증 (기존 validation 유틸리티 사용)
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('현재 비밀번호와 새 비밀번호가 같습니다.');
      return false;
    }
    setError('');
    return true;
  };

  // 비밀번호 변경 핸들러
  const handleChangePassword = async () => {
    if (!validateForm()) return false;

    try {
      await updatePasswordMutation.mutateAsync({
        oldPassword: formData.currentPassword.trim(),
        newPassword: formData.newPassword.trim(),
      });

      // 성공 시 폼 초기화
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // 성공 콜백 호출
      options?.onSuccess?.();

      return true; // 성공
    } catch (error: unknown) {
      console.error('비밀번호 변경 실패:', error);

      // AxiosError인지 확인하는 타입 가드
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
          setError('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (axiosError.response?.status === 404) {
          setError('사용자를 찾을 수 없습니다.');
        } else if (axiosError.response?.status === 409) {
          setError('현재 비밀번호가 일치하지 않습니다.');
        } else if (axiosError.response?.status === 400) {
          setError('잘못된 요청입니다. 입력값을 확인해주세요.');
        } else {
          setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
      return false; // 실패
    }
  };

  return {
    formData,
    setFormData,
    error,
    isLoading: updatePasswordMutation.isPending,
    handleChangePassword,
  };
}
