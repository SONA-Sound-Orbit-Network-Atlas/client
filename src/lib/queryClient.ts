// react query 클라이언트 설정

import { QueryClient } from '@tanstack/react-query';

// 기본 옵션 통일 관리
export default new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2분 동안 fresh로 취급 (기본값 0 : 마운트 마다 재요청)
      gcTime: 1000 * 60 * 10, // 비활성시 10분간 캐시 유지
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 비활성 (이미 해두셨음)
      refetchOnMount: false, // 마운트 시 stale 여부와 관계없이 재요청 막기
      refetchOnReconnect: false,
      retry: 0,
    },
  },
});
