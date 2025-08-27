import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Block } from './blocks';
import Stars from './components/Stars';
import CameraRig from './CameraRig';
import { TitleText, BodyText } from './components/Text';
import { ScrollIndicator } from './components/ScrollIndicator';
import state from './store';
import './styles.css';

// 메인 App 컴포넌트
export default function App() {
  const scrollArea = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(true);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    state.top = e.currentTarget.scrollTop;
    setScrolled(false);
  };

  useEffect(() => {
    if (scrollArea.current) {
      state.top = scrollArea.current.scrollTop;

      // wheel 이벤트도 추가하여 더 자주 업데이트
      const handleWheel = (e: WheelEvent) => {
        const newScrollTop = scrollArea.current!.scrollTop + e.deltaY;
        state.top = Math.max(0, newScrollTop);
      };

      scrollArea.current.addEventListener('wheel', handleWheel);

      return () => {
        if (scrollArea.current) {
          scrollArea.current.removeEventListener('wheel', handleWheel);
        }
      };
    }
  }, []);

  return (
    <>
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

      {/* DOM 스크롤 영역과 HTML 콘텐츠를 함께 관리 */}
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        {scrolled && <ScrollIndicator />}

        {/* Section 1: Intro */}
        <div className="section" style={{ height: '80vh' }}>
          {/* <div
            style={{
              position: 'absolute',
              bottom: '10vh',
              left: '5vw',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.1em',
            }}
          >
            {['Sound', 'Orbit', 'Network', 'Atlas'].map((text, index) => (
              <div
                key={index}
                style={{
                  color: '#eaeaea',
                  fontSize: 'min(8vw, 140px)',
                  fontWeight: 800,
                  lineHeight: 1.06,
                  letterSpacing: '-0.02em',
                  opacity: 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                {text}
              </div>
            ))}
          </div> */}
        </div>

        {/* Text - 1 */}
        <div className="section" style={{ height: '80vh' }}>
          <div
            style={{
              position: 'absolute',
              top: '22vh',
              left: '8vw',
              width: '600px',
              zIndex: 10,
            }}
          >
            <TitleText>Sound</TitleText>
            <BodyText>사운드와 공간을 엮어 경험을 만듭니다.</BodyText>
          </div>
        </div>

        {/* Text - 2 */}
        <div className="section" style={{ height: '80vh' }}>
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <TitleText>Orbit</TitleText>
            <BodyText>데이터를 사운드로 번역해 서사를 구축합니다.</BodyText>
          </div>
        </div>

        {/* Text - 3 */}
        <div className="section" style={{ height: '80vh' }}>
          <div
            style={{
              position: 'absolute',
              top: '22vh',
              right: '8vw',
              width: '600px',
              zIndex: 10,
              textAlign: 'right',
            }}
          >
            <TitleText>Network</TitleText>
            <BodyText>데이터를 사운드로 번역해 서사를 구축합니다.</BodyText>
          </div>
        </div>

        {/* Text - 4 */}
        <div className="section" style={{ height: '80vh' }}>
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <TitleText>Atlas</TitleText>
            <BodyText>이 모든 것을 하나로</BodyText>
          </div>
        </div>

        {/* Section 6: CTA */}
        <div className="section" style={{ height: '70vh' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '50px',
                padding: '20px 40px',
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '200px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'translate(-50%, -50%) scale(1.05)';
                e.currentTarget.style.boxShadow =
                  '0 15px 40px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  'translate(-50%, -50%) scale(1)';
                e.currentTarget.style.boxShadow =
                  '0 10px 30px rgba(102, 126, 234, 0.3)';
              }}
              onClick={() => {
                console.log('Go to Galaxy clicked!');
              }}
            >
              Go to Galaxy
            </button>
          </div>
        </div>
      </div>
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
