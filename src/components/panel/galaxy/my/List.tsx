import { Suspense } from 'react';
import { useGetGalaxyMyList } from '@/hooks/api/useGalaxy';
import CardItem from './CardItem';
import { type GalaxyMyListData } from '@/types/galaxyMy';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingIcon from '@/components/common/LoadingIcon';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';

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
  const { selectStellar } = useStellarSystemSelection();

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
              selectStellar(galaxySystem.id);
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
