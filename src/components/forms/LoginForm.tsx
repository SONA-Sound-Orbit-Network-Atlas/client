import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import type { LoginFormData } from '@/utils/validation';

export interface LoginFormProps {
  formData: LoginFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  onInputChange: (field: keyof LoginFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * 로그인 폼 UI 컴포넌트
 */
export default function LoginForm({
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col mt-[24px] text-left gap-[16px]">
        <TextField label="Email" htmlFor="email">
          <TextInput
            type="email"
            placeholder="Enter your email"
            id="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className={errors.email ? 'border-error' : ''}
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email}</p>
          )}
        </TextField>
        <TextField label="Password" htmlFor="password">
          <TextInput
            type="password"
            placeholder="Enter your password"
            id="password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className={errors.password ? 'border-error' : ''}
          />
          {errors.password && (
            <p className="text-error text-xs mt-1">{errors.password}</p>
          )}
        </TextField>
      </div>
      <Button
        type="submit"
        color="primary"
        size="lg"
        className="w-full mt-[24px]"
        disabled={isLoading}
      >
        {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
      </Button>
    </form>
  );
}
