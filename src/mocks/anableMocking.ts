// 개발 환경에서만 MSW 구동
export default async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./browser');
    await worker.start({
      // 필요 시 옵션 지정
      // onUnhandledRequest: 'bypass' | 'warn' | 'error'
      onUnhandledRequest: 'warn',
    });
  }
}
