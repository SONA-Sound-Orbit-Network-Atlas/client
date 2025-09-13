import PanelTitle from '../../PanelTitle';
import StellarCard from './StellarCard';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import AddNewObjectBtn from './AddNewObjectBtn';

export default function Objects() {
  return (
    <ErrorBoundary FallbackComponent={() => <div>Error</div>}>
      <Suspense fallback={<Loading />}>
        <ObjectsContent />
      </Suspense>
    </ErrorBoundary>
  );
}

// API 결과 반영 완료
function ObjectsContent() {
  const { selectedObjectId, setSelectedObjectId } = useSelectedObjectStore();
  const { stellarStore } = useStellarStore();

  const clickObjectHandler = (id: number) => {
    setSelectedObjectId(id);
  };

  if (!stellarStore) return <div>No data</div>;

  return (
    <div>
      <PanelTitle fontSize="large">
        SYSTEM OBJECTS ({stellarStore.objects.length})
      </PanelTitle>

      <div className="space-y-3">
        {stellarStore.objects.length > 0 ? (
          stellarStore.objects.map((data, index) => {
            return (
              <StellarCard
                key={index}
                index={index}
                data={data}
                onClick={() => clickObjectHandler(data.planetId)}
                active={selectedObjectId === data.planetId}
              />
            );
          })
        ) : (
          <div>STELLAR 데이터가 없습니다.</div>
        )}
      </div>

      {/* new OBJECT 추가 버튼 */}
      <AddNewObjectBtn />
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
