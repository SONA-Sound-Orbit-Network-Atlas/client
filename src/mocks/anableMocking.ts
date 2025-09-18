// MSW 구동
export default async function enableMocking() {
  /* import.meta.env.DEV
    타입: boolean
    개발 모드 (npm run dev): true
    프로덕션 빌드 (npm run build): false */
  if (!import.meta.env.DEV) return;

  // MSW 비활성화 옵션 (실제 API 테스트 시)
  if (import.meta.env.VITE_USE_MOCK === 'false') {
    console.log('MSW disabled - using real API');
    return;
  }

  const { worker } = await import('./browser');

  await worker.start({
    // onUnhandledRequest: 'bypass' | 'warn' | 'error' (간단한 옵션 지정)

    // 커스텀 필터링: 특정 유형만 경고
    onUnhandledRequest(req) {
      // 문서/정적 리소스/HMR 같은 건 무시(조용히 통과)
      const ignorable = ['document', 'script', 'style', 'image', 'font'];
      if (ignorable.includes(req.destination)) return;

      // favicon 조용히 통과
      const { pathname } = new URL(req.url);
      if (
        pathname === '/' ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/assets')
      )
        return;

      // 그 외(정말 API 같은데 핸들러가 없다)만 경고
      // print.warning();
    },
  });
}
