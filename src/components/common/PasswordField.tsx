import TextField from '@/components/common/TextField';
import TextInput from '@/components/common/TextInput';
import { mergeClassNames } from '@/utils/mergeClassNames';

export interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  error?: string;
  className?: string;
}

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  id,
  error,
  className,
}: PasswordFieldProps) {
  return (
    <TextField label={label} htmlFor={id || ''}>
      <TextInput
        type="password"
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={mergeClassNames(error ? 'border-error' : '', className)}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </TextField>
  );
}
