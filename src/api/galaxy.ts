import axiosInstance from '@/lib/axios';
import type {
  GalaxyCommunityResponse,
  ParamsGetGalaxyCommunityList,
} from '@/types/galaxyCommunity';
import type { GalaxyMyData, ParamsGetGalaxyMyList } from '@/types/galaxyMy';
import { endpoints } from './endpoints';

export const galaxyAPI = {
  // 갤럭시 - community 목록 조회
  getGalaxyCommunityList: async (params: ParamsGetGalaxyCommunityList) => {
    const response = await axiosInstance.get<GalaxyCommunityResponse>(
      endpoints.galaxyList.base,
      { params }
    );
    const { data, meta } = response.data;

    return {
      list: data,
      totalCount: meta.total,
      page: meta.page,
      hasNext: meta.hasNext,
    };
  },
  // 갤럭시 - my 목록 조회
  getGalaxyMyList: async (params: ParamsGetGalaxyMyList) => {
    const response = await axiosInstance.get<GalaxyMyData>(
      endpoints.galaxyList.my,
      { params }
    );
    return response.data;
  },
};
