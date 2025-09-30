// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

// 디버깅용 로그
console.log('🔍 Axios 설정 정보:');
console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('- Axios baseURL:', axiosInstance.defaults.baseURL);
console.log('- MSW 사용 여부:', import.meta.env.VITE_USE_MOCK);

// 요청 인터셉터: access_token 자동 삽입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
