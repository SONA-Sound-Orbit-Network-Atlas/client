import { Grid} from '@react-three/drei';
import * as THREE from 'three';
import QuarterViewOrbitControls from "./controllers/QuarterViewOrbitControls";
import Galaxy from "./cosmos/Galaxy";

// 화면 표시
export default function Scene() {

    const axesHelper = new THREE.AxesHelper(5);
    return (
      <>
        {/* 조명 설정 */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
        />
        {/* 별자리 시스템 */}
        <Galaxy />
        
        
        {/* 그리드 헬퍼 (공간감을 위해) */}
        <Grid args={[20, 20]} />
        
        {/* 축 헬퍼 */}
        <primitive object = {axesHelper}/>
       
        <QuarterViewOrbitControls />
      </>
    )
  }