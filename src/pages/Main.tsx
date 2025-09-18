import { Canvas } from '@react-three/fiber';
import IntroSection from '@/components/main/sections/IntroSection';
import TextSection from '@/components/main/sections/TextSection';
import CTASection from '@/components/main/sections/CTASection';
import FloatingCTAButton from '@/components/main/ui/FloatingCTAButton';
import { ScrollIndicator } from '@/components/main/ui/ScrollIndicator';
import Loading from '@/components/main/ui/Loading';
import { useMainScroll } from '@/components/main/hooks/useMainScroll';
import { useCTASection } from '@/components/main/hooks/useCTASection';
import mainStore from '@/components/main/store/mainStore';
import Stars from '@/components/main/canvas/Stars';
import CameraRig from '@/components/main/canvas/CameraRig';
import Content from '@/components/main/canvas/Content';
import { useState } from 'react';

export default function Main() {
  const { scrollArea, isScrolled, onScroll } = useMainScroll();
  const { isInCTASection, updateCTASection } = useCTASection();
  const [isLoading, setIsLoading] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e);
    updateCTASection(e.currentTarget.scrollTop);
  };

  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && (
        <div className="block w-full fixed top-0 left-0 right-0 bottom-0 z-0 h-screen bg-[#0c0f13]">
          <Canvas
            linear
            dpr={[1, 2]}
            orthographic
            camera={{ zoom: mainStore.zoom, position: [0, 0, 500] }}
          >
            {/* 로딩 컴포넌트만 렌더링 */}
            <Loading setIsLoading={setIsLoading} />
          </Canvas>
        </div>
      )}

      {/* 3D Canvas */}
      {!isLoading && (
        <div className="block w-full fixed top-0 left-0 right-0 bottom-0 z-0 h-screen bg-[#0c0f13]">
          <Canvas
            linear
            dpr={[1, 2]}
            orthographic
            camera={{ zoom: mainStore.zoom, position: [0, 0, 500] }}
          >
            {/* 별모임 - 전체 배경으로 항상 보임 */}
            <Stars />

            {/* 카메라 제어 */}
            <CameraRig zStart={10} zEnd={3} />

            {/* 3D 콘텐츠 */}
            <Content />
          </Canvas>
        </div>
      )}

      {/* DOM 스크롤 영역과 HTML 콘텐츠 */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen overflow-y-auto overflow-x-hidden pointer-events-auto z-[1] snap-y snap-mandatory scroll-smooth text-white overscroll-none font-sans ${isLoading ? 'hidden' : ''}`}
        ref={scrollArea}
        onScroll={handleScroll}
      >
        {/* 스크롤 인디케이터 */}
        {!isScrolled && <ScrollIndicator />}

        {/* 섹션들 */}
        <IntroSection />

        <TextSection
          title="Sound"
          description="사운드와 공간을 엮어 경험을 만듭니다."
          alignment="left"
        />

        <TextSection
          title="Orbit"
          description="데이터를 사운드로 번역해 서사를 구축합니다."
          alignment="center"
        />

        <TextSection
          title="Network"
          description="여러 사람들과 음악을 공유해보세요."
          alignment="right"
        />

        <TextSection
          title="Atlas"
          description="이 모든 것을 하나로"
          alignment="center"
        />

        <CTASection />
      </div>

      {/* 플로팅 CTA 버튼 */}
      {!isLoading && (
        <FloatingCTAButton
          isVisible={isScrolled}
          isInCTASection={isInCTASection}
        />
      )}
    </>
  );
}
