import Button from '@/components/common/Button';
import PanelTitle from '../../PanelTitle';
import PlanetCard from './PlanetCard';
import { GoPlus } from 'react-icons/go';
import { useSelectedPlanet } from '@/stores/useSelectedPlanet';
import { useGetPlanetList } from '@/hooks/api/useSystem';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function Index() {
  return (
    <ErrorBoundary FallbackComponent={() => <div>Error</div>}>
      <Suspense fallback={<Loading />}>
        <PlanetsContent />
      </Suspense>
    </ErrorBoundary>
  );
}

// API 결과 반영 완료
function PlanetsContent() {
  const { selectedPlanetNo, setSelectedPlanetNo } = useSelectedPlanet();
  console.log('selectedPlanetNo : ', selectedPlanetNo);

  const { data: planetsData } = useGetPlanetList(1);
  console.log('planetsData : ', planetsData);

  const onClickHandler = (id: number) => {
    setSelectedPlanetNo(id);
  };

  if (!planetsData) return <div>No data</div>;

  return (
    <div>
      <PanelTitle fontSize="text-xs">
        SYSTEM OBJECTS ({planetsData.length})
      </PanelTitle>

      <div className="space-y-3">
        {planetsData.length > 0 ? (
          planetsData.map((data, index) => (
            <PlanetCard
              key={index}
              index={index}
              data={data}
              onClick={() => onClickHandler(index)}
              clicked={selectedPlanetNo === index}
            />
          ))
        ) : (
          <div>PLANETS 데이터가 없습니다.</div>
        )}
      </div>

      <Button color="tertiary" className="w-full mt-6 text-text-muted">
        <GoPlus style={{ width: '14px', height: '14px' }} /> ADD NEW OBJECT
      </Button>
    </div>
  );
}

// 로딩 컴포넌트
function Loading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
