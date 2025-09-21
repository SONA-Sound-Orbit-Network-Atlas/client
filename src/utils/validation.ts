import {
  VALIDATION_MESSAGES,
  VALIDATION_RULES,
} from '@/constants/validationMessages';

export interface ValidationError {
  field: string;
  message: string;
}

export interface SignupFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  identifier: string;
  password: string;
}

/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return VALIDATION_MESSAGES.EMAIL.REQUIRED;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES.EMAIL.INVALID_FORMAT;
  }

  return null;
};

/**
 * 사용자명 검증
 */
export const validateUsername = (username: string): string | null => {
  if (!username) {
    return VALIDATION_MESSAGES.USERNAME.REQUIRED;
  }

  const { MIN_LENGTH, MAX_LENGTH } = VALIDATION_RULES.USERNAME;
  if (username.length < MIN_LENGTH || username.length > MAX_LENGTH) {
    return VALIDATION_MESSAGES.USERNAME.LENGTH;
  }

  return null;
};

/**
 * 비밀번호 검증
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return VALIDATION_MESSAGES.PASSWORD.REQUIRED;
  }

  const { MIN_LENGTH, MAX_LENGTH } = VALIDATION_RULES.PASSWORD;
  if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) {
    return VALIDATION_MESSAGES.PASSWORD.LENGTH;
  }

  return null;
};

/**
 * 비밀번호 확인 검증
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return VALIDATION_MESSAGES.CONFIRM_PASSWORD.REQUIRED;
  }

  if (password !== confirmPassword) {
    return VALIDATION_MESSAGES.CONFIRM_PASSWORD.MISMATCH;
  }

  return null;
};

/**
 * 회원가입 폼 전체 검증
 */
export const validateSignupForm = (
  formData: SignupFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // 각 필드별 검증
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};

/**
 * identifier 검증 (email 또는 username)
 */
export const validateIdentifier = (identifier: string): string | null => {
  if (!identifier) {
    return 'Enter your email or username';
  }
  return null;
};

/**
 * 로그인 폼 전체 검증
 */
export const validateLoginForm = (
  formData: LoginFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const identifierError = validateIdentifier(formData.identifier);
  if (identifierError) errors.identifier = identifierError;

  // 비밀번호 검증 (로그인에서는 길이 제한 없이 필수만 체크)
  if (!formData.password) {
    errors.password = VALIDATION_MESSAGES.PASSWORD.REQUIRED;
  }

  return errors;
};

/**
 * 특정 필드만 검증 (회원가입용)
 */
export const validateField = (
  field: keyof SignupFormData,
  value: string,
  formData?: Partial<SignupFormData>
): string | null => {
  switch (field) {
    case 'email':
      return validateEmail(value);
    case 'username':
      return validateUsername(value);
    case 'password':
      return validatePassword(value);
    case 'confirmPassword':
      return formData?.password
        ? validateConfirmPassword(formData.password, value)
        : null;
    default:
      return null;
  }
};

/**
 * 로그인 필드만 검증
 */
export const validateLoginField = (
  field: keyof LoginFormData,
  value: string
): string | null => {
  switch (field) {
    case 'identifier':
      return validateIdentifier(value);
    case 'password':
      return !value ? VALIDATION_MESSAGES.PASSWORD.REQUIRED : null;
    default:
      return null;
  }
};
