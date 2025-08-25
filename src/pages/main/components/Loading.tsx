import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

type Props = { onComplete: () => void };

const WORDS = ['SOUND', 'ORBIT', 'NETWORK', '&', 'ATLAS'];

export default function Loading({ onComplete }: Props) {
  const { progress } = useProgress(); // 캔버스 리소스 로딩 진행도
  const [animationStep, setAnimationStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  useEffect(() => {
    // 단어별 애니메이션 시퀀스
    const intervals = WORDS.map((_, index) => {
      return setTimeout(() => {
        setAnimationStep(index + 1);
      }, index * 800); // 각 단어마다 800ms 간격
    });

    // 모든 단어가 나온 후 버튼 표시
    const buttonTimeout = setTimeout(
      () => {
        setShowButton(true);
      },
      WORDS.length * 800 + 1000
    ); // 마지막 단어 후 1초 대기

    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(buttonTimeout);
    };
  }, []);

  // 시뮬레이션된 로딩 진행도
  useEffect(() => {
    const wordsCount = 5; // SOUND, ORBIT, NETWORK, &, ATLAS
    const duration = wordsCount * 800 + 500; // 단어 애니메이션 시간 + 여유
    const steps = 60; // 60단계로 나누어 부드럽게
    const stepDuration = duration / steps;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      const progressValue = Math.min((currentStep / steps) * 100, 100);
      setSimulatedProgress(progressValue);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, stepDuration);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="loading-page-container">
      <div className="loading-inner">
        <div className="loading-text">
          <div className="sona-title">SONA</div>
          <div className="sona-subtitle">
            {WORDS.map((word, index) => (
              <span
                key={word}
                className={`word ${index < animationStep ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.8}s` }}
              >
                {word}
                {index < WORDS.length - 1 && index !== 3 ? ' ' : ''}
              </span>
            ))}
          </div>
        </div>

        {showButton && (
          <button className="loading-enter fade-in" onClick={onComplete}>
            Go to Main
          </button>
        )}

        <p className="loading-progress">
          {Math.round(progress > 0 ? progress : simulatedProgress)}%
        </p>
      </div>
    </div>
  );
}
