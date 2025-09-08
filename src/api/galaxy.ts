import axiosInstance from '@/lib/axios';
import type {
  GalaxyCommunityListData,
  ParamsGetGalaxyCommunityList,
} from '@/types/galaxyCommunity';
import type { GalaxyMyListData, ParamsGetGalaxyMyList } from '@/types/galaxyMy';

export const galaxyAPI = {
  // 갤럭시 목록 조회
  getGalaxyCommunityList: async (params: ParamsGetGalaxyCommunityList) => {
    const response = await axiosInstance.get<GalaxyCommunityListData[]>(
      '/galaxies/community',
      {
        params,
      }
    );
    return response.data;
  },
  getGalaxyMyList: async (params: ParamsGetGalaxyMyList) => {
    const response = await axiosInstance.get<GalaxyMyListData[]>(
      '/galaxies/my',
      {
        params,
      }
    );
    return response.data;
  },
};
