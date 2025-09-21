import { useState, useCallback } from 'react';
import { validatePassword, validateConfirmPassword } from '@/utils/validation';

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type PasswordValidationFormData =
  | PasswordFormData
  | ChangePasswordFormData;

// 타입 가드 함수들
export const isPasswordFormData = (
  data: PasswordValidationFormData
): data is PasswordFormData => {
  return 'password' in data && !('currentPassword' in data);
};

export const isChangePasswordFormData = (
  data: PasswordValidationFormData
): data is ChangePasswordFormData => {
  return 'currentPassword' in data && 'newPassword' in data;
};

export interface UsePasswordValidationReturn {
  errors: Record<string, string>;
  validateForm: (formData: PasswordValidationFormData) => boolean;
  handleInputChange: (
    field: string,
    value: string,
    formData: PasswordValidationFormData
  ) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

/**
 * 비밀번호 폼 검증을 위한 커스텀 훅
 * 기존 useSignupValidation 패턴을 재사용
 */
export const usePasswordValidation = (): UsePasswordValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 폼 전체 검증
   */
  const validateForm = useCallback(
    (formData: PasswordValidationFormData): boolean => {
      const newErrors: Record<string, string> = {};

      if (isPasswordFormData(formData)) {
        // 회원가입용 비밀번호 검증
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          newErrors.password = passwordError;
        }

        const confirmPasswordError = validateConfirmPassword(
          formData.password,
          formData.confirmPassword
        );
        if (confirmPasswordError) {
          newErrors.confirmPassword = confirmPasswordError;
        }
      } else if (isChangePasswordFormData(formData)) {
        // 비밀번호 변경용 검증
        if (!formData.currentPassword.trim()) {
          newErrors.currentPassword = 'Enter your current password';
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
          newErrors.newPassword = passwordError;
        }

        const confirmPasswordError = validateConfirmPassword(
          formData.newPassword,
          formData.confirmPassword
        );
        if (confirmPasswordError) {
          newErrors.confirmPassword = confirmPasswordError;
        }

        if (formData.currentPassword === formData.newPassword) {
          newErrors.newPassword =
            'Current password and new password are the same';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    []
  );

  /**
   * 입력 변경 시 실시간 검증 및 에러 제거
   */
  const handleInputChange = useCallback(
    (field: string, value: string, formData: PasswordValidationFormData) => {
      // 입력 시 해당 필드 에러 제거
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }

      // 실시간 검증 (기존 useSignupValidation 패턴과 동일)
      if (
        field === 'password' ||
        field === 'newPassword' ||
        field === 'confirmPassword' ||
        field === 'currentPassword'
      ) {
        let error: string | null = null;

        if (field === 'password' && isPasswordFormData(formData)) {
          error = validatePassword(value);
        } else if (
          field === 'newPassword' &&
          isChangePasswordFormData(formData)
        ) {
          error = validatePassword(value);
        } else if (
          field === 'currentPassword' &&
          isChangePasswordFormData(formData)
        ) {
          // 현재 비밀번호도 newPassword와 동일한 검증 적용
          error = validatePassword(value);
        } else if (field === 'confirmPassword') {
          let passwordValue = '';
          if (isPasswordFormData(formData)) {
            passwordValue = formData.password;
          } else if (isChangePasswordFormData(formData)) {
            passwordValue = formData.newPassword;
          }
          error = validateConfirmPassword(passwordValue, value);
        }

        if (error) {
          setErrors((prev) => ({ ...prev, [field]: error }));
        }
      }
    },
    [errors]
  );

  /**
   * 특정 필드 에러 제거
   */
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * 모든 에러 제거
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * 에러 존재 여부 확인
   */
  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validateForm,
    handleInputChange,
    clearError,
    clearAllErrors,
    hasErrors,
  };
};
