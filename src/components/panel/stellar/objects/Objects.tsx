import PanelTitle from '../../PanelTitle';
import StellarCard from './StellarCard';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import AddNewObjectBtn from './AddNewObjectBtn';
import type { Star, Planet } from '@/types/stellar';

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
  console.log('selectedObjectId ', selectedObjectId);
  const { stellarStore } = useStellarStore();
  const starInfo: Star = stellarStore.star;
  const planetInfo: Planet[] = stellarStore.planets;
  const objectsInfo: (Star | Planet)[] = [starInfo, ...planetInfo];

  if (!objectsInfo) return <div>No data</div>;

  return (
    <div>
      <PanelTitle fontSize="large">
        SYSTEM OBJECTS ({objectsInfo.length})
      </PanelTitle>

      <div className="space-y-3">
        {objectsInfo.length > 0 ? (
          objectsInfo.map((data, index) => {
            const title =
              data.object_type === 'STAR'
                ? stellarStore.name // ★ Star는 시스템 이름을 사용
                : (data.name ?? 'UNTITLED'); // ★ Planet은 자기 name 사용

            return (
              <StellarCard
                key={data.id}
                index={index}
                data={data}
                onClick={() => {
                  setSelectedObjectId(data.id);
                  console.log('data.id ', data.id);
                }}
                active={selectedObjectId === data.id}
                className="cursor-pointer"
                title={title}
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
