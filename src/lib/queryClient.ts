// react query 클라이언트 설정

import { QueryClient } from '@tanstack/react-query';

// 기본 옵션 통일 관리
export default new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2분 동안은 stale 아님 → remount 시 재요청 안 함
      gcTime: 1000 * 60 * 10, // 언마운트 후 10분간 캐시 보존
      refetchOnMount: true, // stale 때만 마운트 시 refetch (그래서 *무효화(invalidate)*를 했을 때만(= stale로 표시됐을 때만) 마운트 시 네트워크 요청이 발생)
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});
