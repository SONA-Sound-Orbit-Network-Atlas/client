import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useUserStore } from '@/stores/useUserStore';
import { useUpdateUserProfile } from '@/hooks/api/useUser';

export interface EditProfileFormData {
  username: string;
  about: string;
}

export interface UseEditProfileOptions {
  onSuccess?: () => void;
}

export function useEditProfile(options?: UseEditProfileOptions) {
  const { userStore } = useUserStore();
  const updateProfileMutation = useUpdateUserProfile();

  // 폼 상태 관리
  const [formData, setFormData] = useState<EditProfileFormData>({
    username: '',
    about: '',
  });
  const [error, setError] = useState('');

  // 현재 사용자 정보로 폼 초기화
  useEffect(() => {
    if (userStore.username) {
      setFormData((prev) => ({ ...prev, username: userStore.username }));
    }
    if (userStore.about) {
      setFormData((prev) => ({ ...prev, about: userStore.about! }));
    }
  }, [userStore]);

  // 폼 검증
  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('사용자명을 입력해주세요.');
      return false;
    }
    if (formData.username.length < 2) {
      setError('사용자명은 2자 이상이어야 합니다.');
      return false;
    }
    setError('');
    return true;
  };

  // 프로필 수정 핸들러
  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      await updateProfileMutation.mutateAsync({
        username: formData.username.trim(),
        about: formData.about.trim(),
      });

      // 성공 콜백 호출
      options?.onSuccess?.();
    } catch (error: unknown) {
      console.error('프로필 수정 실패:', error);

      // AxiosError인지 확인하는 타입 가드
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 409) {
          setError('이미 사용 중인 사용자명입니다.');
        } else if (axiosError.response?.status === 401) {
          setError('인증이 필요합니다. 다시 로그인해주세요.');
        } else if (axiosError.response?.status === 400) {
          setError('잘못된 요청입니다. 입력값을 확인해주세요.');
        } else {
          setError('프로필 수정에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setError('프로필 수정에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return {
    formData,
    setFormData,
    error,
    isLoading: updateProfileMutation.isPending,
    handleSaveChanges,
  };
}
