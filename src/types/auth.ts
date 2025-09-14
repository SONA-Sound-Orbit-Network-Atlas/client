// 회원가입 데이터
export interface SignupData {
  email: string;
  username: string;
  password: string;
}

// 로그인 데이터
export interface LoginData {
  email: string;
  password: string;
}

// 로그인 성공 응답
export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    created_at: string;
    updated_at: string;
  };
}

// API 에러 응답
export interface ApiErrorResponse {
  error: {
    code: number;
    message: string;
  };
  timestamp: string;
  path: string;
}

// 인증 상태 관련 타입 (필요시 사용)
export interface AuthState {
  isLoggedIn: boolean;
}
