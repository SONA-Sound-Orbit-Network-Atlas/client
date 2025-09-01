import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Block } from './blocks';
import Stars from './components/Stars';
import CameraRig from './CameraRig';
import { TitleText, BodyText } from './components/Text';
import { ScrollIndicator } from './components/ScrollIndicator';
import state from './store';

import { useNavigate } from 'react-router-dom';

// 메인 App 컴포넌트
export default function App() {
  const navigate = useNavigate();
  const scrollArea = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInCTASection, setIsInCTASection] = useState(false);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const windowHeight = window.innerHeight;

    state.top = scrollTop;
    setIsScrolled(scrollTop > 0);

    // CTA 섹션 위치 계산 (6개 섹션: intro(80vh) + 4개 text(80vh) + CTA(100vh))
    const ctaSectionStart = windowHeight * (state.sections - 1 - 0.3) * 0.8; // 5개 섹션 * 80vh = 400vh + 화면절반

    // CTA 섹션에 있는지 확인
    const inCTASection = scrollTop >= ctaSectionStart;
    setIsInCTASection(inCTASection);
  };

  useEffect(() => {
    if (scrollArea.current) {
      const el = scrollArea.current;
      state.top = el.scrollTop;

      // wheel 이벤트 - 스크롤 속도 제한
      let isScrolling = false;
      const handleWheel = (e: WheelEvent) => {
        if (isScrolling) return;

        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 100); // 100ms 딜레이로 스크롤 속도 제한

        const newScrollTop = el.scrollTop + e.deltaY;
        state.top = Math.max(0, newScrollTop);
      };

      el.addEventListener('wheel', handleWheel);

      return () => {
        el.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <>
      <div className="block w-full fixed top-0 left-0 right-0 bottom-0 z-0 h-screen bg-[#0c0f13]">
        <Canvas
          linear
          dpr={[1, 2]}
          orthographic
          camera={{ zoom: state.zoom, position: [0, 0, 500] }}
        >
          <Suspense
            fallback={
              <Html center className="loading">
                Loading...
              </Html>
            }
          >
            {/* 별모임 - 전체 배경으로 항상 보임 */}
            <Stars />

            {/* 카메라 제어 */}
            <CameraRig zStart={10} zEnd={3} />

            {/* 3D 콘텐츠 */}
            <Content />
          </Suspense>
        </Canvas>
      </div>

      {/* DOM 스크롤 영역과 HTML 콘텐츠를 함께 관리 */}
      <div
        className="fixed top-0 left-0 w-screen h-screen overflow-y-auto overflow-x-hidden pointer-events-auto z-[1] snap-y snap-mandatory scroll-smooth text-white overscroll-none font-sans"
        ref={scrollArea}
        onScroll={onScroll}
      >
        {isScrolled ? null : <ScrollIndicator />}

        {/* Section 1: Intro */}
        <div className="relative w-full flex items-center justify-center snap-start h-screen"></div>

        {/* Text - 1 */}
        <div className="relative w-full flex items-center justify-center snap-start h-[80vh]">
          <div className="absolute top-[22vh] left-[8vw] w-[600px] z-10">
            <TitleText>Sound</TitleText>
            <BodyText>사운드와 공간을 엮어 경험을 만듭니다.</BodyText>
          </div>
        </div>

        {/* Text - 2 */}
        <div className="relative w-full flex items-center justify-center snap-start h-[80vh]">
          <div className="text-center">
            <TitleText>Orbit</TitleText>
            <BodyText>데이터를 사운드로 번역해 서사를 구축합니다.</BodyText>
          </div>
        </div>

        {/* Text - 3 */}
        <div className="relative w-full flex items-center justify-center snap-start h-[80vh]">
          <div className="absolute top-[22vh] right-[8vw] w-[600px] z-10 text-right">
            <TitleText>Network</TitleText>
            <BodyText>여러 사람들과 음악을 공유해보세요.</BodyText>
          </div>
        </div>

        {/* Text - 4 */}
        <div className="relative w-full flex items-center justify-center snap-start h-[80vh]">
          <div className="text-center">
            <TitleText>Atlas</TitleText>
            <BodyText>이 모든 것을 하나로</BodyText>
          </div>
        </div>

        {/* Section 6: CTA */}
        <div className="relative w-full flex items-center justify-center snap-start h-screen">
          {/* 이 섹션은 이제 빈 공간으로 유지 */}
        </div>
      </div>

      {/* 플로팅 CTA 버튼 */}
      {isScrolled && (
        <button
          className={`fixed z-50 bg-transparent  rounded-2xl py-5 px-10 text-[clamp(18px,2.5vw,24px)] font-semibold text-white cursor-pointer transition-all duration-300 ease-in-out min-w-[200px] hover:bg-black hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] 
            ${
              isInCTASection
                ? 'border-2 border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  shadow-[0_0_30px_rgba(255,255,255,0.2)] '
                : 'bottom-[5%] right-[5%] translate-x-0 translate-y-0 scale-70  shadow-[0_0_30px_rgba(255,255,255,0.1)] '
            }
            `}
          onClick={() => {
            navigate('/galaxy');
          }}
        >
          go to Galaxy
        </button>
      )}
    </>
  );
}

// 3D 콘텐츠 컴포넌트
function Content() {
  return (
    <>
      {/* Section 1: 3D 객체용 (현재는 비어있음) */}
      <Block factor={1} offset={0}>
        <group />
      </Block>

      {/* Section 2: 3D 객체용 */}
      <Block factor={1} offset={1}>
        <group />
      </Block>

      {/* Section 3: 3D 객체용 */}
      <Block factor={1} offset={2}>
        <group />
      </Block>

      {/* Section 4: 3D 객체용 */}
      <Block factor={1} offset={3}>
        <group />
      </Block>
    </>
  );
}
