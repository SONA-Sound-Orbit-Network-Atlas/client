import { useSuspenseQuery } from '@tanstack/react-query';
import { systemAPI } from '@/api/system';

// (INFO) 별 정보 조회
export function useGetStarInfo(galaxyId: number) {
  return useSuspenseQuery({
    queryKey: ['systems', galaxyId],
    queryFn: () => systemAPI.getStarInfo(galaxyId),
  });
}

// (INFO) 행성 정보 조회
export function useGetPlanetInfo(galaxyId: number, planetNo: number) {
  return useSuspenseQuery({
    queryKey: ['systems', galaxyId, planetNo],
    queryFn: () => systemAPI.getPlanetInfo(galaxyId, planetNo),
  });
}

// (PLANETS) 별+행성 목록 조회
export function useGetPlanetList(galaxyId: number) {
  return useSuspenseQuery({
    queryKey: ['planetList', galaxyId],
    queryFn: () => systemAPI.getPlanetList(galaxyId),
  });
}
