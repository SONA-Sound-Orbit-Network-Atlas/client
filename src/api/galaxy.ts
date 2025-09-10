import axiosInstance from '@/lib/axios';
import type {
  GalaxyCommunityData,
  ParamsGetGalaxyCommunityList,
} from '@/types/galaxyCommunity';
import type { GalaxyMyData, ParamsGetGalaxyMyList } from '@/types/galaxyMy';

export const galaxyAPI = {
  // 갤럭시 - community 목록 조회
  getGalaxyCommunityList: async (params: ParamsGetGalaxyCommunityList) => {
    const response = await axiosInstance.get<GalaxyCommunityData>(
      '/galaxies/community',
      { params }
    );
    return response.data;
  },
  // 갤럭시 - my 목록 조회
  getGalaxyMyList: async (params: ParamsGetGalaxyMyList) => {
    const response = await axiosInstance.get<GalaxyMyData>('/galaxies/my', {
      params,
    });
    return response.data;
  },
};
