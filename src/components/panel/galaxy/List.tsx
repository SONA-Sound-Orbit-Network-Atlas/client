import { Suspense } from 'react';
import { useGetGalaxyList } from '@/hooks/api/useGalaxy';
import Item from './Item';
import {
  type SortLabel,
  type GalaxyListData,
  toSortValue,
} from '@/types/galaxy';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorBoundary } from 'react-error-boundary';

const GALAXY_LIST_LIMIT = 3;

export default function List({ sort }: { sort: SortLabel }) {
  return (
    <ErrorBoundary FallbackComponent={GalaxyListError}>
      <Suspense fallback={<GalaxyListLoading />}>
        <GalaxyListContent sort={sort} />
      </Suspense>
    </ErrorBoundary>
  );
}

// 갤럭시 리스트 컨텐츠
function GalaxyListContent({ sort }: { sort: SortLabel }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetGalaxyList({
      page: 0,
      limit: GALAXY_LIST_LIMIT,
      sort: toSortValue(sort),
    });

  const list: GalaxyListData[] = data?.pages.flat() ?? [];

  return (
    <div>
      {/* 은하 리스트 */}
      <div className="space-y-3">
        {list.map((galaxySystem: GalaxyListData, index: number) => (
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
function GalaxyListLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: GALAXY_LIST_LIMIT }).map((_, index) => (
        <SkeletonCard key={index} className="min-h-[110px]" />
      ))}
    </div>
  );
}

// 에러 처리
function GalaxyListError() {
  return <div>Error</div>;
}
