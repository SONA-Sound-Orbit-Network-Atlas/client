import { Suspense } from 'react';
import { useGetGalaxyMyList } from '@/hooks/api/useGalaxy';
import CardItem from './CardItem';
import { type GalaxyMyListData } from '@/types/galaxyMy';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingIcon from '@/components/common/LoadingIcon';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';

const GALAXY_LIST_LIMIT = 3;

export default function List() {
  return (
    <ErrorBoundary FallbackComponent={ErrorComp}>
      <Suspense fallback={<LoadingComp />}>
        <ContentComp />
      </Suspense>
    </ErrorBoundary>
  );
}

// 내 갤럭시 리스트 컨텐츠
function ContentComp() {
  const { openSecondarySidebar } = useSidebarStore();
  const { selectedStellarId, setSelectedStellarId } = useSelectedStellarStore();

  const queryResult = useGetGalaxyMyList({
    page: 1,
    limit: GALAXY_LIST_LIMIT,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = queryResult;

  const myGalaxyList = data?.list ?? [];

  return (
    <div>
      {/* 내 갤럭시 리스트 */}
      <div className="space-y-3">
        {myGalaxyList.map((galaxySystem: GalaxyMyListData) => (
          <CardItem
            key={galaxySystem.id}
            {...galaxySystem}
            onClick={() => {
              // 갤럭시 id 값 변경 => 스텔라 정보 api 호출 및 갱신 후 => 스토어에 저장
              if (galaxySystem.id === selectedStellarId) {
                openSecondarySidebar('stellar');
                return;
              }
              setSelectedStellarId(galaxySystem.id); // 스텔라라 id 값 변경
            }}
          />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasNextPage &&
        (isFetchingNextPage ? (
          <LoadingIcon />
        ) : (
          <Button
            className="mt-4 w-full"
            color="tertiary"
            onClick={() => fetchNextPage()}
          >
            LOAD MORE
          </Button>
        ))}
    </div>
  );
}

// 로딩 컴포넌트 (3개 스켈레톤)
function LoadingComp() {
  return (
    <div className="space-y-3">
      {Array.from({ length: GALAXY_LIST_LIMIT }).map((_, index) => (
        <SkeletonCard key={index} className="min-h-[120px]" />
      ))}
    </div>
  );
}

// 에러 처리
function ErrorComp() {
  return <div>Error</div>;
}
