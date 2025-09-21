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
    <div className="block w-full fixed top-0 left-0 right-0 bottom-0 z-0 h-screen bg-[#000000]">
      <Canvas
        linear
        dpr={[1, 2]}
        orthographic
        camera={{ zoom: mainStore.zoom, position: [0, 0, 500] }}
      >
        {isLoading ? (
          <Loading setIsLoading={setIsLoading} />
        ) : (
          <>
            <Stars />
            <CameraRig zStart={10} zEnd={3} />
            <Content />
          </>
        )}
      </Canvas>
    </div>
  );
}
