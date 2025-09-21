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
      setError('Enter your current password');
      return false;
    }

    // 새 비밀번호 검증 (기존 validation 유틸리티 사용)
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('Current password and new password are the same');
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
      console.error('Password change failed:', error);

      // AxiosError인지 확인하는 타입 가드
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
          setError('Authentication is required. Please log in again.');
        } else if (axiosError.response?.status === 404) {
          setError('User not found');
        } else if (axiosError.response?.status === 409) {
          setError('Current password does not match');
        } else if (axiosError.response?.status === 400) {
          setError('Invalid request. Please check your input.');
        } else {
          setError('Password change failed. Please try again.');
        }
      } else {
        setError('Password change failed. Please try again.');
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
