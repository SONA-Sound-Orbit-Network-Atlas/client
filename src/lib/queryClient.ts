// react query 클라이언트 설정

import { QueryClient } from '@tanstack/react-query';

// 기본 옵션 통일 관리
export default new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});
