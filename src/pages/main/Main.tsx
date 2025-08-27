// src/pages/main/Main.tsx
import { Suspense } from 'react';
import App from './index';

export default function Main() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
}
