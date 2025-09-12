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

// 인증 상태 관련 타입 (필요시 사용)
export interface AuthState {
  isLoggedIn: boolean;
}
