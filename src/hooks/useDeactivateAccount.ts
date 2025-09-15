import { useState, useCallback } from 'react';
import { useDeactivateAccount as useDeactivateAccountAPI } from '@/hooks/api/useUser';

export interface UseDeactivateAccountReturn {
  // 상태
  showDeactivateForm: boolean;
  deactivatePassword: string;
  deactivateError: string;
  passwordValidationError: string;
  isDeactivateLoading: boolean;

  // 액션
  handleDeactivateClick: () => void;
  handleDeactivateCancel: () => void;
  handlePasswordChange: (value: string) => void;
  handleDeactivateSubmit: () => void;
}

/**
 * 회원탈퇴 관련 상태와 로직을 관리하는 커스텀 훅
 */
export const useDeactivateAccount = (): UseDeactivateAccountReturn => {
  // 회원탈퇴 관련 상태
  const [showDeactivateForm, setShowDeactivateForm] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deactivateError, setDeactivateError] = useState('');
  const [passwordValidationError, setPasswordValidationError] = useState('');

  // API 훅
  const { mutate: deactivateAccount, isPending: isDeactivateLoading } =
    useDeactivateAccountAPI();

  // 비밀번호 유효성 검사 함수 (로그인과 동일)
  const validatePassword = useCallback((password: string): string | null => {
    if (!password) {
      return '비밀번호를 입력해주세요.';
    }
    return null;
  }, []);

  // 비밀번호 입력 핸들러 (실시간 검증)
  const handlePasswordChange = useCallback(
    (value: string) => {
      setDeactivatePassword(value);

      // 실시간 검증
      const error = validatePassword(value);
      setPasswordValidationError(error || '');

      // 기존 API 에러가 있다면 제거
      if (deactivateError) {
        setDeactivateError('');
      }
    },
    [validatePassword, deactivateError]
  );

  // 회원탈퇴 폼 열기
  const handleDeactivateClick = useCallback(() => {
    setShowDeactivateForm(true);
    setDeactivateError('');
    setPasswordValidationError('');
  }, []);

  // 회원탈퇴 폼 닫기
  const handleDeactivateCancel = useCallback(() => {
    setShowDeactivateForm(false);
    setDeactivatePassword('');
    setDeactivateError('');
    setPasswordValidationError('');
  }, []);

  // 회원탈퇴 제출
  const handleDeactivateSubmit = useCallback(() => {
    // 유효성 검사 먼저 실행
    const validationError = validatePassword(deactivatePassword);
    if (validationError) {
      setPasswordValidationError(validationError);
      return;
    }

    // 유효성 검사 통과 시 API 호출
    deactivateAccount(
      { password: deactivatePassword },
      {
        onSuccess: () => {
          console.log('회원탈퇴가 완료되었습니다.');
          // 성공 시 자동으로 로그아웃 처리됨 (useDeactivateAccount에서 처리)
        },
        onError: (error: any) => {
          console.error('회원탈퇴 실패:', error);
          if (error.response?.status === 409) {
            setDeactivateError('비밀번호가 일치하지 않습니다.');
          } else if (error.response?.status === 401) {
            setDeactivateError('인증에 실패했습니다.');
          } else if (error.response?.status === 404) {
            setDeactivateError('사용자를 찾을 수 없습니다.');
          } else {
            setDeactivateError('회원탈퇴 중 오류가 발생했습니다.');
          }
        },
      }
    );
  }, [deactivatePassword, validatePassword, deactivateAccount]);

  return {
    // 상태
    showDeactivateForm,
    deactivatePassword,
    deactivateError,
    passwordValidationError,
    isDeactivateLoading,

    // 액션
    handleDeactivateClick,
    handleDeactivateCancel,
    handlePasswordChange,
    handleDeactivateSubmit,
  };
};
