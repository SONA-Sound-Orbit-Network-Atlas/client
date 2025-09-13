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

// 인증 상태 관련 타입
export interface AuthState {
  isLoggedIn: boolean;
}

// 인증 액션 관련 타입
export interface AuthActions {
  setLoginStatus: (status: boolean) => void;
}

// 통합 인증 타입
export type AuthStore = AuthState & AuthActions;
