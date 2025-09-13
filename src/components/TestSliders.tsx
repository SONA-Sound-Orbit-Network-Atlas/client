import { Slider } from './common/Slider';
import { useSceneStore } from '@/stores/useSceneStore';

export default function TestSliders() {
  const { selectedPlanetIndex, selectedStellarSystem, updatePlanetProperty } =
    useSceneStore();

  let currentPlanet = null;

  if (selectedPlanetIndex !== null && selectedStellarSystem !== null) {
    currentPlanet = selectedStellarSystem?.planets[selectedPlanetIndex];
  }

  if (!currentPlanet) {
    return <div>행성을 선택해주세요</div>;
  }

  return (
    <div className="w-100">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          행성 설정
        </h2>
      </div>
      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4">
        <Slider
          value={[currentPlanet.planetSize]}
          onValueChange={(value) => {
            if (selectedPlanetIndex !== null) {
              updatePlanetProperty(selectedPlanetIndex, 'planetSize', value[0]);
            }
          }}
          max={1.0}
          min={0.01}
          step={0.01}
          label="행성 크기"
        />
        <Slider
          value={[currentPlanet.planetBrightness]}
          onValueChange={(value) => {
            if (selectedPlanetIndex !== null) {
              updatePlanetProperty(
                selectedPlanetIndex,
                'planetBrightness',
                value[0]
              );
            }
          }}
          max={5.0}
          min={0}
          step={0.1}
          label="행성 밝기"
        />
        <Slider
          value={[currentPlanet.distanceFromStar]}
          onValueChange={(value) => {
            if (selectedPlanetIndex !== null) {
              updatePlanetProperty(
                selectedPlanetIndex,
                'distanceFromStar',
                value[0]
              );
            }
          }}
          max={10}
          min={1}
          step={0.1}
          label="행성 거리"
        />
        <Slider
          value={[currentPlanet.orbitSpeed]}
          onValueChange={(value) => {
            if (selectedPlanetIndex !== null) {
              updatePlanetProperty(selectedPlanetIndex, 'orbitSpeed', value[0]);
            }
          }}
          max={20}
          min={0.1}
          step={0.1}
          label="행성 공전 속도"
        />
        <Slider
          value={[currentPlanet.rotationSpeed]}
          onValueChange={(value) => {
            if (selectedPlanetIndex !== null) {
              updatePlanetProperty(
                selectedPlanetIndex,
                'rotationSpeed',
                value[0]
              );
            }
          }}
          max={20}
          min={1}
          step={1}
          label="행성 자전 속도"
        />
        <Slider
          value={[currentPlanet.inclination]}
          onValueChange={(value) => {
            if (selectedPlanetIndex !== null) {
              updatePlanetProperty(
                selectedPlanetIndex,
                'inclination',
                value[0]
              );
            }
          }}
          max={180}
          min={-180}
          step={1}
          label="행성 기울기"
        />
        <Slider
          value={[currentPlanet.eccentricity]}
          onValueChange={(value) => {
            if (selectedPlanetIndex !== null) {
              updatePlanetProperty(
                selectedPlanetIndex,
                'eccentricity',
                value[0]
              );
            }
          }}
          max={0.99}
          min={0}
          step={0.01}
          label="행성 이심률"
        />
      </div>
    </div>
  );
}
