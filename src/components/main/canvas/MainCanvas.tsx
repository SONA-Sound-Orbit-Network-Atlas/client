import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import mainStore from '../store/mainStore';
import Stars from './Stars';
import CameraRig from './CameraRig';
import Content from './Content';

export default function MainCanvas() {
  return (
    <div className="block w-full fixed top-0 left-0 right-0 bottom-0 z-0 h-screen bg-[#0c0f13]">
      <Canvas
        linear
        dpr={[1, 2]}
        orthographic
        camera={{ zoom: mainStore.zoom, position: [0, 0, 500] }}
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
  );
}
