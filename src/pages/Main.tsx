import FloatingCTAButton from '@/components/main/ui/FloatingCTAButton';
import MainCanvas from '@/components/main/canvas/MainCanvas';
import ScrollContainer from '@/components/main/scroll/ScrollContainer';
import { useState, useCallback } from 'react';

export default function Main() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInCTASection, setIsInCTASection] = useState(false);

  const handleScrollStateChange = useCallback(
    (scrolled: boolean, inCTASection: boolean) => {
      setIsScrolled(scrolled);
      setIsInCTASection(inCTASection);
    },
    []
  );

  return (
    <>
      {/* 3D Canvas */}
      <MainCanvas isLoading={isLoading} setIsLoading={setIsLoading} />

      {/* DOM 스크롤 영역과 HTML 콘텐츠 */}
      <ScrollContainer
        isLoading={isLoading}
        onScrollStateChange={handleScrollStateChange}
      />

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
