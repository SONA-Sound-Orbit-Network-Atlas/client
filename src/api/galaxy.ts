import axiosInstance from '@/lib/axios';
import type { ParamsGetAllStellarList } from '@/types/galaxy';
import type {
  GalaxyCommunityResponse,
  ParamsGetGalaxyCommunityList,
} from '@/types/galaxyCommunity';
import type { GalaxyMyData, ParamsGetGalaxyMyList } from '@/types/galaxyMy';
import { endpoints } from './endpoints';
import { getGalaxyMock } from '@/mocks/data/galaxyMock';

export const galaxyAPI = {
  // 갤럭시 - community 목록 조회
  getGalaxyCommunityList: async (params: ParamsGetGalaxyCommunityList) => {
    const response = await axiosInstance.get<GalaxyCommunityResponse>(
      endpoints.galaxyList.base,
      { params }
    );
    const { data, meta } = response.data;
    console.log('response : ', response);
    console.log('data : ', data);
    console.log('meta : ', meta);

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
  // 갤럭시 - 모든 스텔라 목록 조회
  getAllStellarList: async (params: ParamsGetAllStellarList) => {
    // 목 데이터 사용 (개발 중)
    return getGalaxyMock(params.id);

    // 실제 API 호출 (나중에 활성화)
    // const response = await axiosInstance.get<Galaxy>(
    //   '/api/stellar-systems/all',
    //   { params }
    // );
    // return response.data;
  },
};
