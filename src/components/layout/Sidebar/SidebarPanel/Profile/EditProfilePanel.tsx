import { useProfileStore } from '@/stores/useProfileStore';
import { useEditProfile } from '@/hooks/useEditProfile';
import { useChangePassword } from '@/hooks/useChangePassword';
import { useDeactivateAccount } from '@/hooks/useDeactivateAccount';
import PanelHeader from '../PanelHeader';
import Iconframe from '@/components/common/Iconframe';
import { FiUser } from 'react-icons/fi';
import TextField from '@/components/common/TextField';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import { ScrollArea } from '@/components/common/Scrollarea';
import Textarea from '@/components/common/Textarea';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function EditProfilePanel() {
  const { setProfilePanelMode } = useProfileStore();
  const { formData, setFormData, error, isLoading, handleSaveChanges } =
    useEditProfile({
      onSuccess: () => {
        setProfilePanelMode('profile');
      },
    });
  const {
    formData: passwordFormData,
    setFormData: setPasswordFormData,
    error: passwordError,
    isLoading: isPasswordLoading,
    handleChangePassword,
  } = useChangePassword({
    onSuccess: () => {
      setProfilePanelMode('profile');
    },
  });

  // 회원탈퇴 관련 로직
  const {
    showDeactivateForm,
    deactivatePassword,
    deactivateError,
    passwordValidationError,
    isDeactivateLoading,
    handleDeactivateClick,
    handleDeactivateCancel,
    handlePasswordChange,
    handleDeactivateSubmit,
  } = useDeactivateAccount();

  // 프로필 수정 핸들러
  const handleSubmit = async () => {
    await handleSaveChanges();
  };

  // 비밀번호 변경 핸들러
  const handlePasswordSubmit = async () => {
    await handleChangePassword();
  };

  return (
    <>
      <PanelHeader
        title="EDIT PROFILE"
        showBackButton={true}
        onBack={() => setProfilePanelMode('profile')}
      />
      <div className="flex flex-col h-full overflow-hidden items-center">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 flex flex-col">
            <div className="text-center">
              <Iconframe color="primary" size="large" className="mb-[16px]">
                <FiUser />
              </Iconframe>
              <p className="text-primary-300 text-sm text-center">
                CHANGE AVATAR
              </p>
            </div>
            {/* EDIT PROFILE */}
            <div className="w-full border-b border-gray-border pb-[24px]">
              <div className="w-full mt-[24px] gap-[20px] flex flex-col">
                <TextField label="USERNAME" htmlFor="username">
                  <TextInput
                    type="text"
                    placeholder="Enter your username"
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </TextField>
                <TextField label="ABOUT" htmlFor="about">
                  <Textarea
                    placeholder="Tell us about yourself..."
                    id="about"
                    value={formData.about}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        about: e.target.value,
                      }))
                    }
                  />
                </TextField>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="mt-4">
                  <ErrorMessage message={error} />
                </div>
              )}

              <div className="w-full">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full mt-[24px]"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
                </Button>
              </div>
            </div>
            {/* CHANGE PASSWORD */}
            <div className="mt-[24px] border-b border-gray-border pb-[24px]">
              <h3 className="text-secondary-300 font-semibold mb-[24px]">
                CHANGE PASSWORD
              </h3>
              <div className="w-full gap-[20px] flex flex-col">
                <TextField label="CURRENT PASSWORD" htmlFor="current-password">
                  <TextInput
                    type="password"
                    placeholder="Enter current password"
                    id="current-password"
                    value={passwordFormData.currentPassword}
                    onChange={(e) =>
                      setPasswordFormData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                  />
                </TextField>
                <TextField label="NEW PASSWORD" htmlFor="new-password">
                  <TextInput
                    type="password"
                    placeholder="Enter new password"
                    id="new-password"
                    value={passwordFormData.newPassword}
                    onChange={(e) =>
                      setPasswordFormData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </TextField>
                <TextField
                  label="CONFIRM NEW PASSWORD"
                  htmlFor="confirm-new-password"
                >
                  <TextInput
                    type="password"
                    placeholder="Confirm new password"
                    id="confirm-new-password"
                    value={passwordFormData.confirmPassword}
                    onChange={(e) =>
                      setPasswordFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </TextField>
              </div>

              {/* 비밀번호 변경 에러 메시지 */}
              {passwordError && (
                <div className="mt-4">
                  <ErrorMessage message={passwordError} />
                </div>
              )}

              <div className="w-full">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full mt-[24px]"
                  onClick={handlePasswordSubmit}
                  disabled={isPasswordLoading}
                >
                  {isPasswordLoading ? 'CHANGING...' : 'SAVE CHANGES'}
                </Button>
              </div>
            </div>
            {/* DEACTIVATE ACCOUNT */}
            <div className="w-full mt-[24px] flex flex-col">
              {showDeactivateForm ? (
                <div className="p-4 border border-error/20 rounded-lg bg-error/5">
                  <h3 className="text-error font-medium mb-4 text-center">
                    DEACTIVATE ACCOUNT
                  </h3>

                  <TextField label="CONFIRMATION" htmlFor="deactivate-password">
                    <TextInput
                      type="password"
                      placeholder="Enter your password"
                      id="deactivate-password"
                      value={deactivatePassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={passwordValidationError ? 'border-error' : ''}
                    />
                  </TextField>

                  {/* 비밀번호 유효성 검사 에러 메시지 */}
                  {passwordValidationError && (
                    <div className="mt-2">
                      <p className="text-error text-xs">
                        {passwordValidationError}
                      </p>
                    </div>
                  )}

                  {/* 회원탈퇴 에러 메시지 */}
                  {deactivateError && (
                    <div className="mt-4">
                      <ErrorMessage message={deactivateError} />
                    </div>
                  )}

                  <div className="flex gap-1 mt-4">
                    <Button
                      color="secondary"
                      size="sm"
                      className="flex-1 bg-error/20 text-error border-error/30 hover:bg-error/30 hover:border-error/50"
                      onClick={handleDeactivateSubmit}
                      disabled={
                        isDeactivateLoading ||
                        !!passwordValidationError ||
                        !deactivatePassword.trim()
                      }
                    >
                      {isDeactivateLoading ? 'DEACTIVATING...' : 'CONFIRM'}
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={handleDeactivateCancel}
                      disabled={isDeactivateLoading}
                    >
                      CANCEL
                    </Button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-text-muted text-sm text-center cursor-pointer hover:text-error transition-colors"
                  onClick={handleDeactivateClick}
                >
                  DEACTIVATE ACCOUNT
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
