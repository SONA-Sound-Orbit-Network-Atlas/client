import { useGetGalaxyList } from '@/hooks/api/useGalaxy';
import GalaxySystemCard from './GalaxySystemCard';
import { dummyGalaxySystems } from './dummy_galaxys';
import type { SortLabel } from '@/types/galaxy';

const GALAXY_LIST_LIMIT = 5;

export default function GalaxySystemList({
  position,
}: {
  position: SortLabel;
}) {
  // const {
  //   data: galaxyList,
  //   isLoading,
  //   isError,
  //   error,
  // } = useGetGalaxyList({ page: 1, limit: GALAXY_LIST_LIMIT, sort: position });

  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-3">
      {dummyGalaxySystems.map((galaxySystem) => (
        <GalaxySystemCard key={galaxySystem.rank} {...galaxySystem} />
      ))}
    </div>
  );
}
