import { Canvas } from '@react-three/fiber';
import mainStore from '../store/mainStore';
import Stars from './Stars';
import CameraRig from './CameraRig';
import Content from './Content';
import Loading from '../ui/Loading';

interface MainCanvasProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function MainCanvas({
  isLoading,
  setIsLoading,
}: MainCanvasProps) {
  // #0c0f13 이전 배경색
  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && (
        <div className="block w-full fixed top-0 left-0 right-0 bottom-0 z-0 h-screen bg-[#000000]">
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
        <div className="block w-full fixed top-0 left-0 right-0 bottom-0 z-0 h-screen bg-[#000000]">
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
    </>
  );
}
