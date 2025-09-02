import { useQuery } from '@tanstack/react-query';
import { galaxyAPI } from '@/api/galaxy';
import type { ParamsGetGalaxyList } from '@/types/galaxy';

// 은하 목록 조회
export function useGetGalaxyList(params: ParamsGetGalaxyList) {
  return useQuery({
    queryKey: ['galaxyList'],
    queryFn: () => galaxyAPI.getGalaxyList(params),
  });
}

// 추후 작성 예정...
// 은하 생성
// 은하 삭제
// 등등
