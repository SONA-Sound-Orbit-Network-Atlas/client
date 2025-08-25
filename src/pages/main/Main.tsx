import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import './Main.css';
import Loading from './components/Loading';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionWrap, { SECTIONS } from './components/SectionWrap';
import Scene from './components/r3f/Scene';

export default function Main() {
  // 로딩 → 메인 전환 제어
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // 섹션 수에 따른 자동 계산
  const totalPages = SECTIONS.length;

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // 로딩 완료 후 메인 페이지 페이드인
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <div
      className={`main-page ${isVisible ? 'visible' : ''}`}
      style={{ '--total-pages': totalPages } as React.CSSProperties}
    >
      {/* 고정 헤더 (스크롤과 독립적) */}
      <Header />

      {/* 통합 캔버스 (3D + HTML 동기화) */}
      <Canvas
        camera={{
          fov: 50, // 시야각 (작을수록 망원, 클수록 광각)
          position: [0, 0, 10], // 카메라 거리 조절 (Z값이 클수록 멀어짐)
        }}
        className="background-canvas"
      >
        <ScrollControls pages={totalPages} damping={0.15}>
          {/* 3D 씬 */}
          <Scene ready={true} totalPages={totalPages} />

          {/* HTML 레이어 (스크롤과 동기화) */}
          <Scroll html style={{ width: '100%' }}>
            <div className="ui-layer">
              <SectionWrap />
              <Footer />
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
