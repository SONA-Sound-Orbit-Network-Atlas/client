import axiosInstance from '@/lib/axios';
import type { ParamsGetGalaxyList } from '@/types/galaxy';

export const galaxyAPI = {
  // 갤럭시 목록 조회
  // 사용 예시 : galaxyAPI.getGalaxyList({ page: 1, limit: 10, sort: 'name' })
  getGalaxyList: async (params: ParamsGetGalaxyList) => {
    const response = await axiosInstance.get('/galaxies', { params });
    return response.data;
  },
};
