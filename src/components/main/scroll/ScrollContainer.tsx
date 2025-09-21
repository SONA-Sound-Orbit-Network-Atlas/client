import { useEffect } from 'react';
import { useMainScroll } from '../hooks/useMainScroll';
import { useCTASection } from '../hooks/useCTASection';
import { ScrollIndicator } from './ScrollIndicator';
import SectionsList from './SectionsList';

interface ScrollContainerProps {
  isLoading: boolean;
  onScrollStateChange: (isScrolled: boolean, isInCTASection: boolean) => void;
}

export default function ScrollContainer({
  isLoading,
  onScrollStateChange,
}: ScrollContainerProps) {
  const { scrollArea, isScrolled, onScroll } = useMainScroll();
  const { isInCTASection, updateCTASection } = useCTASection();

  // 상태 변화를 부모에게 전달
  useEffect(() => {
    onScrollStateChange(isScrolled, isInCTASection);
  }, [isScrolled, isInCTASection, onScrollStateChange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e);
    updateCTASection(e.currentTarget.scrollTop);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen overflow-y-auto overflow-x-hidden pointer-events-auto z-[1] snap-y snap-mandatory scroll-smooth text-white overscroll-none font-sans ${isLoading ? 'hidden' : ''}`}
      ref={scrollArea}
      onScroll={handleScroll}
    >
      {/* 스크롤 인디케이터 */}
      {!isScrolled && <ScrollIndicator />}

      {/* 섹션들 */}
      <SectionsList />
    </div>
  );
}
