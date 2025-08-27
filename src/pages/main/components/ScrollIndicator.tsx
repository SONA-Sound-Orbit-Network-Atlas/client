import { useState, useEffect } from 'react';

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '5vh',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Scroll 텍스트 */}
      <div
        style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}
      >
        Scroll
      </div>

      {/* 화살표 아이콘 */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'bounce 2s infinite',
        }}
      >
        <path
          d="M7 10L12 15L17 10"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>

      {/* 귀여운 스크롤바 아이콘 */}
      <svg
        width="16"
        height="24"
        viewBox="0 0 16 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'scrollBar 2s infinite',
        }}
      >
        {/* 스크롤바 배경 */}
        <rect
          x="6"
          y="2"
          width="4"
          height="20"
          rx="2"
          fill="#ffffff"
          opacity="0.3"
        />
        {/* 스크롤바 핸들 */}
        <rect
          x="7"
          y="4"
          width="2"
          height="6"
          rx="1"
          fill="#ffffff"
          opacity="0.8"
        />
      </svg>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-8px);
            }
            60% {
              transform: translateY(-4px);
            }
          }
          
          @keyframes scrollBar {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(8px);
            }
          }
        `}
      </style>
    </div>
  );
}
