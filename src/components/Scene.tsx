import Galaxy from './cosmos/Galaxy';
import MainCamera from './systems/MainCamera';
import BackgroundStars from './cosmos/BackgroundStars';
import BackgroundStarsVer2 from './cosmos/BackgroundStarsVer2';

// 화면 표시
export default function Scene() {
  return (
    <>
      {/* 조명 설정 */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      {/* 별자리 시스템 */}
      <group layers={0}>
        <Galaxy />
      </group>

      <MainCamera />

      {/* 배경 */}
      {/* <BackgroundStars /> */}
      <BackgroundStarsVer2 />
    </>
  );
}
