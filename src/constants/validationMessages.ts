export const VALIDATION_MESSAGES = {
  EMAIL: {
    REQUIRED: 'Enter your email',
    INVALID_FORMAT: 'Enter a valid email format',
  },
  USERNAME: {
    REQUIRED: 'Enter your username',
    LENGTH: 'Username must be between 3 and 20 characters',
  },
  PASSWORD: {
    REQUIRED: 'Enter your password',
    LENGTH: 'Password must be between 6 and 50 characters',
  },
  CONFIRM_PASSWORD: {
    REQUIRED: 'Enter your password confirmation',
    MISMATCH: 'Password does not match',
  },
} as const;

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
} as const;
