// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: accessToken 자동 삽입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리 → refresh 시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const accessToken = localStorage.getItem('accessToken');

    if (error.response) {
      console.log('HTTP 통신 자체 성공');
    } else {
      console.log('HTTP 통신 자체 실패');
    }
    // 401 에러 + accessToken이 '있었던' 경우 → refresh 시도
    if (
      error.response?.status === 401 &&
      accessToken &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/v1/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        console.log('refresh 시도');
        // accessToken 갱신 요청 => 오류 => refresh 토큰 유효하지 않음 => error throw (catch 이동)
        const res = await axiosInstance.post('/api/v1/auth/refresh');

        // accessToken 갱신 요청 => 성공 => 새로운 accessToken 발급 => 요청 재시도
        const newToken = res.data.accessToken; // 바디 (JSON)

        localStorage.setItem('accessToken', newToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // accessToken이 아예 '없는' 경우 → 로그인 페이지 이동 => 현재 프로젝트에선 공통처리 X => 각 API에서 처리
    // if (
    //   error.response?.status === 401 &&
    //   !accessToken &&
    //   window.location.pathname !== '/login'
    // ) {
    //   window.location.href = '/login';
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
