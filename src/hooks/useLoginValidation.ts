import { useState, useCallback } from 'react';
import {
  validateLoginForm,
  validateLoginField,
  type LoginFormData,
} from '@/utils/validation';

export interface UseLoginValidationReturn {
  errors: Record<string, string>;
  validateForm: (formData: LoginFormData) => boolean;
  handleInputChange: (field: keyof LoginFormData, value: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

/**
 * 로그인 폼 검증을 위한 커스텀 훅
 */
export const useLoginValidation = (): UseLoginValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 폼 전체 검증
   */
  const validateForm = useCallback((formData: LoginFormData): boolean => {
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  /**
   * 입력 변경 시 에러 제거만 수행 (실시간 검증 제거)
   */
  const handleInputChange = useCallback(
    (field: keyof LoginFormData, value: string) => {
      // 입력 시 해당 필드 에러만 제거 (실시간 검증 없음)
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
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
