// 브라우저에서 핸들러를 동작시킬 Service Worker를 준비한다.
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
