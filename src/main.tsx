import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import enableMocking from './mocks/anableMocking.ts';

// worker.start() 끝난 뒤 앱을 랜더링해야 초기 요청을 가로챌 수 있음
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
