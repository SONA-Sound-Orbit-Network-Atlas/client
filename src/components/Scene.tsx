import { Grid} from '@react-three/drei';
import * as THREE from 'three';
import CustomOrbitControls from "./CustomOrbitControls";
import DummySphere from "./DummySphere";

// 화면 표시
export default function Scene() {
    return (
      <>
        {/* 조명 설정 */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
        />
        
        {/* 여러 개의 구체들을 다양한 위치에 배치 */}
        <DummySphere position={[0, 0, 0]} color="#ff6b6b" size={1.5} />
        <DummySphere position={[3, 2, 0]} color="#4ecdc4" size={1} />
        <DummySphere position={[-3, -1, 2]} color="#45b7d1" size={0.8} />
        <DummySphere position={[0, 3, -2]} color="#96ceb4" size={1.2} />
        <DummySphere position={[4, -2, 1]} color="#feca57" size={0.6} />
        <DummySphere position={[-4, 1, -1]} color="#ff9ff3" size={0.9} />
        
        {/* 그리드 헬퍼 (공간감을 위해) */}
        <Grid args={[20, 20]} />
        
        {/* 축 헬퍼 */}
        <primitive object = {new THREE.AxesHelper(5)}/>
       
        <CustomOrbitControls />
      </>
    )
  }