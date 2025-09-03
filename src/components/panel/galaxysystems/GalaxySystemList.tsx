import { useGetGalaxyList } from '@/hooks/api/useGalaxy';
import GalaxySystemCard from './GalaxySystemCard';
import {
  type SortLabel,
  type GalaxyListData,
  toSortValue,
} from '@/types/galaxy';
import Button from '@/components/common/Button';

const GALAXY_LIST_LIMIT = 3;

export default function GalaxySystemList({ sort }: { sort: SortLabel }) {
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useGetGalaxyList({
    page: 0,
    limit: GALAXY_LIST_LIMIT,
    sort: toSortValue(sort),
  });

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;

  const list: GalaxyListData[] = data?.pages.flat() ?? [];

  return (
    <div>
      {/* 은하 리스트 */}
      <div className="space-y-3">
        {list.map((galaxySystem: GalaxyListData, index: number) => (
          <GalaxySystemCard key={index} {...galaxySystem} />
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
