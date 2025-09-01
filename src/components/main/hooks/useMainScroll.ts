import { useEffect, useRef, useState } from 'react';
import mainStore from '../store/mainStore';

export function useMainScroll() {
  const scrollArea = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;

    mainStore.top = scrollTop;
    setIsScrolled(scrollTop > 0);
  };

  useEffect(() => {
    if (scrollArea.current) {
      const el = scrollArea.current;
      mainStore.top = el.scrollTop;

      // wheel 이벤트 - 스크롤 속도 제한
      let isScrolling = false;
      const handleWheel = (e: WheelEvent) => {
        if (isScrolling) return;

        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 100); // 100ms 딜레이로 스크롤 속도 제한

        const newScrollTop = el.scrollTop + e.deltaY;
        mainStore.top = Math.max(0, newScrollTop);
      };

      el.addEventListener('wheel', handleWheel);

      return () => {
        el.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return {
    scrollArea,
    isScrolled,
    onScroll,
  };
}
