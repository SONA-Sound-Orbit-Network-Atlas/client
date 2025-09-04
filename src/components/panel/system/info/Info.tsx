import { Suspense } from 'react';
import { useSelectedPlanet } from '@/stores/useSelectedPlanet';
import Button from '@/components/common/Button';
import StarInfoComponent from './StarInfoComponent';
import PlanetInfoComponent from './PlanetInfoComponent';
import { ErrorBoundary } from 'react-error-boundary';

export default function Info() {
  const { selectedPlanetNo, setSelectedPlanetNo } = useSelectedPlanet();

  // 테스트용 버튼 => STAR / PLANET
  const planetNames = [
    'CENTER STAR',
    'MERCURY',
    'VENUS',
    'EARTH',
    'MARS',
    'JUPITER',
  ];

  return (
    <div>
      {/* 테스트용 */}
      <div className="mb-4">
        <p>행성 바꾸기 TEST 버튼</p>
        <div className="flex items-center gap-2 flex-wrap">
          {planetNames.map((name, index) => {
            return (
              <Button
                key={name}
                color="tertiary"
                size="xs"
                onClick={() => {
                  setSelectedPlanetNo(index);
                }}
                className="text-xs text-text-secondary"
              >
                {name.toUpperCase()}
              </Button>
            );
          })}
        </div>
      </div>
      {/* 테스트용 */}

      {/* 조건부 렌더링 with Suspense */}
      <ErrorBoundary FallbackComponent={InfoError}>
        <Suspense fallback={<InfoLoading />}>
          {selectedPlanetNo === 0 ? (
            <StarInfoComponent />
          ) : (
            <PlanetInfoComponent planetNo={selectedPlanetNo} />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// 로딩 컴포넌트
function InfoLoading() {
  return (
    <div className="animate-pulse min-h-[430px] bg-gray-card rounded p-4">
      <div className="h-6  rounded mb-4 w-24"></div>
      <div className="rounded p-4 space-y-4">
        <div className="h-4 bg-gray-600 rounded w-16"></div>
        <div className="h-8 bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-600 rounded w-20"></div>
        <div className="h-4 bg-gray-600 rounded w-32"></div>
        <div className="h-4 bg-gray-600 rounded w-28"></div>
        <div className="h-4 bg-gray-600 rounded w-36"></div>
      </div>
    </div>
  );
}

// 에러 컴포넌트
function InfoError() {
  return <div>Error</div>;
}
