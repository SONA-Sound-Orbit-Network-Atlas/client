import { Suspense, useEffect } from 'react';
import { useGetStellarList } from '@/hooks/api/useGalaxy';
import CardItem from './CardItem';
import {
  type SortLabel,
  type StellarListItem,
  toSortValue,
} from '@/types/stellarList';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingIcon from '@/components/common/LoadingIcon';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import type { FallbackProps } from 'react-error-boundary';

const GALAXY_LIST_LIMIT = 3;

export default function List({ sort }: { sort: SortLabel }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorComp}
      resetKeys={[sort]} // sort 바뀌면 에러 초기화
      onReset={reset} // React Query 에러 상태도 리셋
    >
      <Suspense fallback={<LoadingComp />}>
        <ContentComp sort={sort} />
      </Suspense>
    </ErrorBoundary>
  );
}

// 갤럭시 리스트 컨텐츠
function ContentComp({ sort }: { sort: SortLabel }) {
  const { selectStellar } = useStellarSystemSelection();

  useEffect(() => {
    console.log('toSortValue(sort) : ', toSortValue(sort));
  }, [sort]);
  // 갤럭시 리스트 데이터
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetStellarList({
      page: 1,
      limit: GALAXY_LIST_LIMIT,
      rank_type: toSortValue(sort),
    });
  // 평탄화 된 list 데이터
  const galaxyCommunityList = data?.list ?? [];
  console.log('galaxyCommunityList : ', galaxyCommunityList);

  if (galaxyCommunityList.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div className="w-full">
      {/* 은하 리스트 */}
      <div className="space-y-3 w-full">
        {galaxyCommunityList.map((galaxySystem: StellarListItem) => (
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
        <SkeletonCard key={index} className="min-h-[140px]" />
      ))}
    </div>
  );
}

// 에러 처리
function ErrorComp({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-4">
      <p className="mb-2">Error occurred</p>
      <Button color="tertiary" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
}
