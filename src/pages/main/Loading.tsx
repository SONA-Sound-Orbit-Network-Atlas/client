// src/pages/main/Loading.tsx
import { useEffect, useState } from 'react';
import './Loading.css';

type Props = {
  onDone: () => void;
  minDurationMs?: number;
  autoCloseDelayMs?: number;
};

export default function Loading({
  onDone,
  minDurationMs = 1200,
  autoCloseDelayMs = -1, // 기본값: 자동으로 닫히지 않음
}: Props) {
  const [display, setDisplay] = useState(0);
  const [ready, setReady] = useState(false);

  // 진행률 애니메이션
  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const elapsed = now - start;
      const minP = Math.min(100, (elapsed / minDurationMs) * 100);

      const real = (window as any).__realProgress__ ?? 100;
      const target = Math.max(minP, real);

      setDisplay((prev) => {
        const diff = target - prev;
        const next = prev + diff * 0.1;
        return next > 99.8 ? 100 : next;
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [minDurationMs]);

  // 완료 상태 체크
  useEffect(() => {
    if (display >= 100 && !ready) {
      setReady(true);
    }
  }, [display, ready]);

  // 옵션: 자동 닫기
  useEffect(() => {
    if (ready && autoCloseDelayMs >= 0) {
      const t = setTimeout(onDone, autoCloseDelayMs);
      return () => clearTimeout(t);
    }
  }, [ready, autoCloseDelayMs, onDone]);

  // 키보드로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ready) return;
      if (e.key === 'Enter' || e.key === ' ') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready, onDone]);

  return (
    <div className="loading-root">
      {/* ✅ 풀스크린 검은 배경 */}
      <div className="loading-bg" />

      <div className="loading-ui">
        <div className="loading-title">Loading</div>
        <div className="loading-percent">{Math.round(display)}%</div>
        <button
          className={`loading-btn ${ready ? 'show' : ''}`}
          onClick={onDone}
          disabled={!ready}
        >
          Go to main ↵
        </button>
      </div>
    </div>
  );
}
