import PanelTitle from '../../PanelTitle';
import ControlPanel from './Guages';
import Random from './Random';
import { usePlanetProperties } from '@/stores/usePlanetProperties';

export default function Index() {
  const { planetProperties, setPlanetProperties } = usePlanetProperties();

  // 1. 나중에 리액트쿼리 훅으로 gaugeData 받기
  // 2. gaugeData 를 기반으로 => minMaxArray 만들기

  return (
    <div>
      <div className="Properties-Header flex justify-between items-center mb-4">
        <PanelTitle className="mb-0">PROPERTIES</PanelTitle>

        {/* 랜덤 버튼 */}
        <Random
          planetProperties={planetProperties}
          setPlanetProperties={setPlanetProperties}
        />
      </div>

      {/* 게이지 */}
      <ControlPanel
        planetProperties={planetProperties}
        setPlanetProperties={setPlanetProperties}
      />
    </div>
  );
}
