import { navigateBack } from '@/utils/profileNavigation';
import PanelHeader from '../PanelHeader';
import CardItem from '@/components/panel/galaxy/community/CardItem';
import { ScrollArea } from '@/components/common/Scrollarea';
import { SkeletonCard } from '@/components/common/Card/SkeletonCard';
import { useGetMyLikesInfinite } from '@/hooks/api/useLikes';
import Button from '@/components/common/Button';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';

export default function LikesPanel() {
  // 갤럭시 선택 훅
  const { selectStellar } = useStellarSystemSelection();

  // API 호출 - 내가 좋아요 한 항성계 목록 조회 (무한스크롤)
  const {
    allItems,
    hasMore,
    isLoadingMore,
    isLoading,
    error,
    loadMore,
    totalCount,
  } = useGetMyLikesInfinite({
    limit: 20,
  });

  // 로딩 상태 - 스켈레톤 UI
  if (isLoading) {
    return (
      <>
        <PanelHeader
          title="MY LIKES"
          showBackButton={true}
          onBack={navigateBack}
        />
        <div className="flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              <p className="text-text-muted text-sm font-semibold mb-[16px]">
                TOTAL LIKES (0)
              </p>
              <div className="space-y-3">
                {/* 스켈레톤 카드들 */}
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }

  // 에러 상태 - 재시도 기능 포함
  if (error) {
    return (
      <>
        <PanelHeader
          title="MY LIKES"
          showBackButton={true}
          onBack={navigateBack}
        />
        <div className="flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  Failed to load likes
                </h3>
                <p className="text-text-muted text-sm max-w-sm">
                  Unable to load your liked stellar systems. Please check your
                  connection and try again.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }

  return (
    <>
      <PanelHeader
        title="MY LIKES"
        showBackButton={true}
        onBack={navigateBack}
      />
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <p className="text-text-muted text-sm font-semibold mb-[16px]">
              TOTAL LIKES ({totalCount})
            </p>

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="text-center py-4">
                <p className="text-text-muted">Loading...</p>
              </div>
            )}

            {/* 에러 상태 */}
            {error && (
              <div className="text-center py-4">
                <p className="text-red-400">Failed to load likes</p>
              </div>
            )}

            {/* 좋아요 목록 */}
            {!isLoading && !error && allItems.length > 0 && (
              <div className="space-y-3">
                {allItems.map((item) => (
                  <CardItem
                    key={item.id}
                    {...item}
                    onClick={() => {
                      selectStellar(item.id);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Load More 버튼 */}
            {hasMore && !error && allItems.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  color="tertiary"
                  className="w-full"
                >
                  {isLoadingMore ? 'Loading...' : 'LOAD MORE'}
                </Button>
              </div>
            )}

            {/* 모든 데이터 로드 완료 메시지 */}
            {!hasMore && allItems.length > 0 && (
              <div className="text-center mt-6">
                <p className="text-text-muted text-sm">
                  All liked stellar systems loaded
                </p>
              </div>
            )}

            {/* 빈 상태 */}
            {!isLoading && !error && allItems.length === 0 && (
              <div className="text-center py-4">
                <p className="text-text-muted">No liked stellar systems.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
