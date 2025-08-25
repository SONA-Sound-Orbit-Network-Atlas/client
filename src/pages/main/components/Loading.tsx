import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import StarsField from './r3f/StarsField';

type LoadingSphereProps = {
  progress: number;
  onComplete: () => void;
};

function LoadingScene({ progress, onComplete }: LoadingSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const [isCompleted, setIsCompleted] = useState(false);
  const [expandProgress, setExpandProgress] = useState(0);
  const [startExpansion, setStartExpansion] = useState(false);

  // 로딩 완료 시 자동으로 별 확산 시작
  useEffect(() => {
    if (progress >= 100 && !isCompleted) {
      setIsCompleted(true);
      setStartExpansion(true);
      // 별 확산 애니메이션 후 메인으로 전환
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [progress, isCompleted, onComplete]);

  useFrame((_, delta) => {
    if (!sphereRef.current) return;

    // 완료 후 확산 애니메이션
    if (isCompleted && expandProgress < 1) {
      setExpandProgress((prev) => Math.min(prev + delta * 2, 1));
    }

    // 로딩 진행도에 따른 밝기 조절 (0%에서는 완전히 어둡게)
    const brightness = progress / 100;

    if (sphereRef.current.material && 'color' in sphereRef.current.material) {
      // 어두운 민트색에서 밝은 민트색으로
      const darkColor = new THREE.Color('#1a3a3a'); // 어두운 민트색
      const brightColor = new THREE.Color('#06b6d4'); // 밝은 민트색 (cyan-500)
      const currentColor = darkColor.clone().lerp(brightColor, brightness);

      (sphereRef.current.material as THREE.MeshBasicMaterial).color =
        currentColor;
    }

    // 블룸 레이어도 진행도에 따라 조절
    if (brightness > 0.2) {
      sphereRef.current.layers.enable(1); // 블룸 효과 활성화
    } else {
      sphereRef.current.layers.disable(1); // 블룸 효과 비활성화
    }

    // 구가 항상 보이도록 기본 레이어에도 추가
    sphereRef.current.layers.enable(0);

    // 완료 후 페이드아웃 (크기 변화 없이 빠르게)
    if (isCompleted) {
      // 크기는 그대로 유지
      sphereRef.current.scale.setScalar(1);

      // 빠른 페이드아웃 (2배 빠르게)
      const fastFadeOut = 1 - Math.min(expandProgress * 2, 1);

      if (
        sphereRef.current.material &&
        'opacity' in sphereRef.current.material
      ) {
        (sphereRef.current.material as THREE.MeshBasicMaterial).opacity =
          fastFadeOut;
      }
    }
  });

  return (
    <>
      {/* 로딩 구 */}
      <mesh
        ref={sphereRef}
        layers={1} // 블룸 레이어
        visible={!isCompleted || expandProgress < 0.5}
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial
          color="#1a3a3a"
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>

      {/* 별들 - 구 안에서 시작해서 바깥으로 퍼져나감 */}
      <StarsField
        count={2500}
        autoExpand={startExpansion}
        centerStart={true} // 중앙에서 시작
      />
    </>
  );
}

type Props = {
  onComplete: () => void;
};

export default function Loading({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);

  useEffect(() => {
    // 로딩 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // 점진적으로 느려지는 로딩
        const increment = Math.max(0.5, (100 - prev) * 0.03);
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 로딩 완료 시 텍스트 페이드아웃
  useEffect(() => {
    if (progress >= 100) {
      const fadeInterval = setInterval(() => {
        setTextOpacity((prev) => {
          const newOpacity = prev - 0.02; // 빠른 페이드아웃
          if (newOpacity <= 0) {
            clearInterval(fadeInterval);
            return 0;
          }
          return newOpacity;
        });
      }, 16); // 60fps
    }
  }, [progress]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* 3D 캔버스 */}
      <Canvas
        camera={{
          fov: 50,
          position: [0, 0, 5],
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <color attach="background" args={['#000000']} />
        <LoadingScene progress={progress} onComplete={onComplete} />

        {/* 블룸 효과 - 예시 코드와 유사한 설정 */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.0}
            luminanceSmoothing={0.4}
            radius={0.85}
          />
        </EffectComposer>
      </Canvas>

      {/* 로딩 텍스트 - 별 확산과 함께 페이드아웃 */}
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
          opacity: textOpacity,
          transition: 'opacity 0.1s ease-out',
        }}
      >
        <div style={{ marginBottom: '10px' }}>LOADING...</div>
        <div
          style={{
            fontSize: '14px',
            opacity: 0.7,
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
