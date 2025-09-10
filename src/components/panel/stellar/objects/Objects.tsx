import Button from '@/components/common/Button';
import PanelTitle from '../../PanelTitle';
import StellarCard from './StellarCard';
import { GoPlus } from 'react-icons/go';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

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
  console.log('selectedObjectId : ', selectedObjectId);

  const { stellarStore } = useStellarStore();
  console.log('stellarStore : ', stellarStore);

  const onClickHandler = (id: string) => {
    setSelectedObjectId(id);
  };

  if (!stellarStore) return <div>No data</div>;

  return (
    <div>
      <PanelTitle fontSize="text-xs">
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
                onClick={() => onClickHandler(data.id)}
                active={selectedObjectId === data.id}
              />
            );
          })
        ) : (
          <div>STELLAR 데이터가 없습니다.</div>
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
