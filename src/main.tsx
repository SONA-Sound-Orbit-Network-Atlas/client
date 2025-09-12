import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// import enableMocking from './mocks/anableMocking.ts';

// MSW 비활성화 - 실제 API 테스트를 위해
// enableMocking().then(() => {
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// });
