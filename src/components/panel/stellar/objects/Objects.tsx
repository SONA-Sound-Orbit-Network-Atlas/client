import PanelTitle from '../../PanelTitle';
import StellarCard from './StellarCard';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import AddNewObjectBtn from './AddNewObjectBtn';
import type { Star, Planet } from '@/types/stellar';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useUserStore } from '@/stores/useUserStore';

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
  const { mode } = useSelectedStellarStore();
  const { userStore } = useUserStore();
  const isStellarOwner = stellarStore.creator_id === userStore.id;
  // === 스텔라 상세정보 스토어에서 object 정보(Star, Planet)만 추출 ===
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
          objectsInfo.map((data) => {
            const name =
              data.object_type === 'STAR'
                ? stellarStore.star.name
                : (data.name ?? 'UNTITLED');

            return (
              <StellarCard
                key={data.id}
                data={data}
                onClick={() => {
                  console.log('=================data.id', data.id);
                  setSelectedObjectId(data.id);
                }}
                active={selectedObjectId === data.id}
                className="cursor-pointer"
                name={name}
              />
            );
          })
        ) : (
          <div>STELLAR 데이터가 없습니다.</div>
        )}
      </div>

      {/* new OBJECT 추가 버튼 */}
      {(isStellarOwner || mode === 'create') && <AddNewObjectBtn />}
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
