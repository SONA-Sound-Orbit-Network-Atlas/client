// MSW 구동
export default async function enableMocking() {
  if (!import.meta.env.DEV) return; // 개발 환경에서만 MSW 구동

  const { worker } = await import('./browser');

  await worker.start({
    // onUnhandledRequest: 'bypass' | 'warn' | 'error' (간단한 옵션 지정)

    // 커스텀 필터링: 특정 유형만 경고
    onUnhandledRequest(req, print) {
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
      print.warning();
    },
  });
}
