import axiosInstance from '@/lib/axios';
import type { GalaxyListData, ParamsGetGalaxyList } from '@/types/galaxy';

export const galaxyAPI = {
  // 갤럭시 목록 조회
  getGalaxyList: async (params: ParamsGetGalaxyList) => {
    const response = await axiosInstance.get<GalaxyListData[]>('/galaxies', {
      params,
    });
    return response.data;
  },
};
