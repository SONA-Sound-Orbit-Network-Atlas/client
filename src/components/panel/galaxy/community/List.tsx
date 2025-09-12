import { Suspense } from 'react';
import { useGetGalaxyCommunityList } from '@/hooks/api/useGalaxy';
import CardItem from './CardItem';
import {
  type SortLabel,
  type GalaxyCommunityListData,
  toSortValue,
} from '@/types/galaxyCommunity';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingIcon from '@/components/common/LoadingIcon';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useSidebarStore } from '@/stores/sidebarStore';

const GALAXY_LIST_LIMIT = 3;

export default function List({ sort }: { sort: SortLabel }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorComp}>
      <Suspense fallback={<LoadingComp />}>
        <ContentComp sort={sort} />
      </Suspense>
    </ErrorBoundary>
  );
}

// 갤럭시 리스트 컨텐츠
function ContentComp({ sort }: { sort: SortLabel }) {
  const { selectedStellarId, setSelectedStellarId } = useSelectedStellarStore();
  const { openSecondarySidebar } = useSidebarStore();

  // 갤럭시 리스트 데이터
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetGalaxyCommunityList({
      page: 1,
      limit: GALAXY_LIST_LIMIT,
      sort: toSortValue(sort),
    });
  // 평탄화 된 list 데이터
  const galaxyCommunityList = data?.list ?? [];

  return (
    <div>
      {/* 은하 리스트 */}
      <div className="space-y-3">
        {galaxyCommunityList.map((galaxySystem: GalaxyCommunityListData) => (
          <CardItem
            key={galaxySystem.id}
            {...galaxySystem}
            onClick={() => {
              console.log('은하리스트 카드 클릭');
              // 갤럭시 id 값 변경 => 스텔라 정보 api 호출 및 갱신 후 => 스토어에 저장
              console.log('갤럭시 id 값 변경 : ', galaxySystem.id);
              if (galaxySystem.id === selectedStellarId) {
                openSecondarySidebar('stellar');
                return;
              }
              setSelectedStellarId(galaxySystem.id); // 스텔라 id 값 변경
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
function ErrorComp() {
  return <div>Error</div>;
}
