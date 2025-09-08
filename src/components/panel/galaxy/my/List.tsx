import { Suspense } from 'react';
import { useGetGalaxyMyList } from '@/hooks/api/useGalaxy';
import Item from './CardItem';
import { type GalaxyMyListData } from '@/types/galaxyMy';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorBoundary } from 'react-error-boundary';

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

// 갤럭시 리스트 컨텐츠
function ContentComp() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetGalaxyMyList({
      page: 0,
      limit: GALAXY_LIST_LIMIT,
    });

  const list: GalaxyMyListData[] = data?.pages.flat() ?? [];

  return (
    <div>
      {/* 은하 리스트 */}
      <div className="space-y-3">
        {list.map((galaxySystem: GalaxyMyListData, index: number) => (
          <Item key={index} {...galaxySystem} />
        ))}
      </div>
      {isFetchingNextPage && <div>loading more...</div>}

      {/* 더보기 버튼 */}
      {hasNextPage && (
        <Button
          className="mt-4 w-full"
          color="tertiary"
          onClick={() => fetchNextPage()}
        >
          LOAD MORE
        </Button>
      )}
    </div>
  );
}

// 로딩 컴포넌트 (3개 스켈레톤)
function LoadingComp() {
  return (
    <div className="space-y-3">
      {Array.from({ length: GALAXY_LIST_LIMIT }).map((_, index) => (
        <SkeletonCard key={index} className="min-h-[110px]" />
      ))}
    </div>
  );
}

// 에러 처리
function ErrorComp() {
  return <div>Error</div>;
}
