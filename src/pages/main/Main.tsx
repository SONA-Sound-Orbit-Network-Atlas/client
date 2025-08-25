import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import './Main.css';
import Scene from './components/r3f/Scene';
import StarsField from './components/r3f/StarsField';

// 로딩 텍스트 컴포넌트
function LoadingText() {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 로딩 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // 100% 완료 시 페이드아웃 시작
          const fadeInterval = setInterval(() => {
            setOpacity((prevOpacity) => {
              const newOpacity = prevOpacity - 0.02;
              if (newOpacity <= 0) {
                clearInterval(fadeInterval);
                return 0;
              }
              return newOpacity;
            });
          }, 16);
          return 100;
        }
        const increment = Math.max(0.5, (100 - prev) * 0.03);
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '300',
        letterSpacing: '2px',
        textAlign: 'center',
        opacity: opacity,
        transition: 'opacity 0.1s ease-out',
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: '10px' }}>LOADING...</div>
      <div style={{ fontSize: '14px', opacity: 0.7 }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

// 로딩 3D 씬 컴포넌트
function LoadingScene({ onComplete }: { onComplete: () => void }) {
  const [startExpansion, setStartExpansion] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blinkIntensity, setBlinkIntensity] = useState(1);

  useEffect(() => {
    // 로딩 진행도 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // 100% 완료 시 별 확산 시작
          setTimeout(() => {
            setStartExpansion(true);
            // 별 확산 후 메인으로 전환
            setTimeout(() => {
              onComplete();
            }, 2000);
          }, 500);
          return 100;
        }
        const increment = Math.max(0.5, (100 - prev) * 0.03);
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // 깜빡임 효과
    const blinkInterval = setInterval(() => {
      setBlinkIntensity((prev) => {
        // 사인파를 이용한 부드러운 깜빡임
        const time = Date.now() * 0.003; // 속도 조절
        const blink = 0.7 + 0.3 * Math.sin(time); // 0.7~1.0 사이에서 깜빡임
        return blink;
      });
    }, 16); // 60fps

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <>
      {/* 로딩 구 - 깜빡임 효과 추가 */}
      <mesh layers={1} visible={!startExpansion}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial
          color={`hsl(${180 + progress * 0.1}, 70%, ${(20 + progress * 0.6) * blinkIntensity}%)`}
          transparent
          opacity={blinkIntensity}
          toneMapped={false}
        />
      </mesh>

      {/* 별들 */}
      <StarsField count={2500} autoExpand={startExpansion} centerStart={true} />

      {/* 로딩 씬 블룸 효과 */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.0}
          luminanceSmoothing={0.4}
          radius={0.85}
        />
      </EffectComposer>
    </>
  );
}

export default function Main() {
  // 로딩 → 메인 전환 제어
  const [isLoading, setIsLoading] = useState(true);
  const [starsExpanded, setStarsExpanded] = useState(false);
  const [zoom, setZoom] = useState(10); // 줌 상태 관리

  const handleLoadingComplete = () => {
    // 별 확산이 완료된 후 메인으로 전환
    setStarsExpanded(true);
    setIsLoading(false);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.max(3, prevZoom - 2)); // 줌 인 (가까워짐)
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.min(30, prevZoom + 2)); // 줌 아웃 (멀어짐)
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        zIndex: 1000,
      }}
    >
      {/* 통합 3D 캔버스 - 로딩과 메인이 연속적으로 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Canvas
          camera={{
            fov: 50,
            position: [0, 0, isLoading ? 5 : 10], // 로딩 시 더 가까이
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <color attach="background" args={['#000000']} />

          {isLoading ? (
            // 로딩 상태: 구와 별들
            <LoadingScene onComplete={handleLoadingComplete} />
          ) : (
            // 메인 상태: 확산된 별들 + 이미지 갤러리 (ScrollControls 추가)
            <ScrollControls pages={4} infinite damping={0.2}>
              <Scene ready={true} autoExpandStars={starsExpanded} zoom={zoom} />
            </ScrollControls>
          )}

          {/* 블룸 효과는 각 씬에서 개별 처리 */}
        </Canvas>
      </div>

      {/* 로딩 텍스트 오버레이 */}
      {isLoading && <LoadingText />}

      {/* 줌 컨트롤 버튼 - 메인 페이지에서만 표시 */}
      {!isLoading && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <button
            onClick={handleZoomIn}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid #06b6d4',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#06b6d4',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            +
          </button>

          <button
            onClick={handleZoomOut}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid #06b6d4',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#06b6d4',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            −
          </button>

          {/* 줌 레벨 표시 */}
          <div
            style={{
              color: '#06b6d4',
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '5px',
            }}
          >
            {Math.round(((30 - zoom) / 27) * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}
