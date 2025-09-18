import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/queryClient';
import { useUserStore } from './stores/useUserStore';
import { useEffect } from 'react';

function App() {
  const { initializeAuth } = useUserStore();

  useEffect(() => {
    // 앱 시작 시 인증 상태 초기화
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
