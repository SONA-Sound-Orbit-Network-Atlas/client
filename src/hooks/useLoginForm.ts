import { useState } from 'react';
import { AxiosError } from 'axios';
import { useLogin } from '@/hooks/api/useAuth';
import { useLoginValidation } from '@/hooks/useLoginValidation';
import type { LoginFormData } from '@/utils/validation';

export interface UseLoginFormOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}

export interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  handleInputChange: (field: keyof LoginFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearErrors: () => void;
}

/**
 * 로그인 폼의 모든 로직을 통합 관리하는 커스텀 훅
 */
export const useLoginForm = (
  options?: UseLoginFormOptions
): UseLoginFormReturn => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const {
    errors,
    validateForm,
    handleInputChange: clearFieldError,
  } = useLoginValidation();
  const loginMutation = useLogin(formData);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    try {
      await loginMutation.mutateAsync();
      options?.onSuccess?.();
    } catch (error: AxiosError) {
      console.error('로그인 실패:', error);
      options?.onError?.(error);
    }
  };

  const clearErrors = () => {
    // 검증 에러는 useLoginValidation에서 관리되므로 별도 처리 불필요
    // API 에러는 mutation이 관리
  };

  return {
    formData,
    errors,
    isLoading: loginMutation.isPending,
    handleInputChange,
    handleSubmit,
    clearErrors,
  };
};
