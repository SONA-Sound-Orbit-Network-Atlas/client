import { useEffect, useState } from 'react';
import { useProgress, Html } from '@react-three/drei';

type LoadingProps = {
  onComplete?: () => void; // 선택적 prop으로 변경
  setIsLoading?: (isLoading: boolean) => void;
};

export default function Loading({ onComplete, setIsLoading }: LoadingProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const { progress, loaded, total } = useProgress(); // 실제 R3F 로딩 상태

  useEffect(() => {
    const startTime = Date.now();
    const minLoadingTime = 2000; // 최소 2초

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minTimeProgress = Math.min((elapsed / minLoadingTime) * 100, 100);

      // R3F 로딩 진행률 (0-100)
      const r3fProgress = progress;
      const isR3FComplete = total === 0 || (loaded === total && total > 0); // total이 0이면 로딩할 게 없으므로 완료로 간주

      let targetProgress;

      if (isR3FComplete && elapsed >= minLoadingTime) {
        // 실제 R3F 로딩 완료 + 최소 시간 경과 = 100%
        targetProgress = 100;
      } else if (isR3FComplete) {
        // 실제 R3F 로딩 완료했지만 최소 시간 안 됨 = 90%에서 대기
        targetProgress = Math.min(minTimeProgress, 90);
      } else {
        // 실제 R3F 로딩 중 = R3F 진행률과 시간 기반 중 작은 값 (최대 85%)
        const combinedProgress = Math.min(
          r3fProgress * 0.85,
          minTimeProgress * 0.85
        );
        targetProgress = Math.min(combinedProgress, 85);
      }

      setDisplayProgress((prev) => {
        const newProgress = Math.max(prev, targetProgress);

        if (newProgress >= 100) {
          clearInterval(interval);
          // 로딩 완료 처리 - 테스트용으로 주석처리
          setTimeout(() => {
            setIsLoading?.(false);
            onComplete?.();
          }, 300); // 부드러운 전환을 위한 짧은 딜레이
          return 100;
        }

        // 부드러운 애니메이션을 위해 점진적으로 증가
        return prev + (newProgress - prev) * 0.1;
      });
    }, 16); // 60fps (약 16ms마다 업데이트)

    return () => clearInterval(interval);
  }, [progress, loaded, total, onComplete, setIsLoading]);

  // 로딩이 완료되면 아무것도 렌더링하지 않음 - 테스트용으로 주석처리
  if (displayProgress >= 100) {
    return null;
  }

  return (
    <Html center>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white">
        {/* Loading 텍스트 */}
        <div className="text-2xl font-bold mb-8 tracking-wide">Loading...</div>

        {/* 프로그래스 바 */}
        <div className="w-80 h-2 min-h-2 rounded-full mb-6 border border-white/50 relative bg-white/20 block">
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out bg-white shadow-white/50"
            style={{
              width: `${displayProgress}%`,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
            }}
          />
        </div>

        {/* 퍼센테이지 */}
        <div className="text-lg font-semibold">
          {Math.round(displayProgress)}%
        </div>
      </div>
    </Html>
  );
}
