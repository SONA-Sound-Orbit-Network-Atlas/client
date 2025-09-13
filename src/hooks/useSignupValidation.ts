import { useState, useCallback } from 'react';
import {
  validateSignupForm,
  validateField,
  type SignupFormData,
} from '@/utils/validation';

export interface UseSignupValidationReturn {
  errors: Record<string, string>;
  validateForm: (formData: SignupFormData) => boolean;
  handleInputChange: (
    field: keyof SignupFormData,
    value: string,
    formData: SignupFormData
  ) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

/**
 * 회원가입 폼 검증을 위한 커스텀 훅
 */
export const useSignupValidation = (): UseSignupValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 폼 전체 검증
   */
  const validateForm = useCallback((formData: SignupFormData): boolean => {
    const newErrors = validateSignupForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  /**
   * 입력 변경 시 실시간 검증 및 에러 제거
   */
  const handleInputChange = useCallback(
    (field: keyof SignupFormData, value: string, formData: SignupFormData) => {
      // 입력 시 해당 필드 에러 제거
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }

      // 실시간 검증 (선택적)
      // 특정 필드에 대해서만 실시간 검증을 원한다면 여기서 처리
      // 예: 이메일 형식, 비밀번호 길이 등
      if (field === 'email' || field === 'username' || field === 'password') {
        const error = validateField(field, value, formData);
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
