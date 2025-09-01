import { useState } from 'react';
import mainStore from '../store/mainStore';

export function useCTASection() {
  const [isInCTASection, setIsInCTASection] = useState(false);

  const updateCTASection = (scrollTop: number) => {
    const windowHeight = window.innerHeight;

    // CTA 섹션 위치 계산 (6개 섹션: intro(80vh) + 4개 text(80vh) + CTA(100vh))
    const ctaSectionStart = windowHeight * (mainStore.sections - 1 - 0.3) * 0.8;

    // CTA 섹션에 있는지 확인
    const inCTASection = scrollTop >= ctaSectionStart;
    setIsInCTASection(inCTASection);
  };

  return {
    isInCTASection,
    updateCTASection,
  };
}
