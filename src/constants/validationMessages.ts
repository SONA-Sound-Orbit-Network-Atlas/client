export const VALIDATION_MESSAGES = {
  EMAIL: {
    REQUIRED: '이메일을 입력해주세요.',
    INVALID_FORMAT: '올바른 이메일 형식을 입력해주세요.',
  },
  USERNAME: {
    REQUIRED: '사용자명을 입력해주세요.',
    LENGTH: '사용자명은 3-20자 사이여야 합니다.',
  },
  PASSWORD: {
    REQUIRED: '비밀번호를 입력해주세요.',
    LENGTH: '비밀번호는 6-50자 사이여야 합니다.',
  },
  CONFIRM_PASSWORD: {
    REQUIRED: '비밀번호 확인을 입력해주세요.',
    MISMATCH: '비밀번호가 일치하지 않습니다.',
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
