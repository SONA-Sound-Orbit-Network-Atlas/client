// src/api/galaxy.ts
import axiosInstance from '@/lib/axios';
import type { ParamsGetStellarList } from '@/types/stellarList';
import type { StellarListResponse, StellarListPage } from '@/types/stellarList';
import { endpoints } from './endpoints';
import type { GalaxyAllStellarListResponse } from '@/types/galaxy';
import type { ParamsGetAllStellarList } from '@/types/galaxy';

// 공용 어댑터: 서버 응답 → 앱 포맷
function adaptStellarList(res: StellarListResponse): StellarListPage {
  const { data, meta } = res;
  return {
    list: data,
    total: meta.total,
    page: meta.page,
    hasNext: meta.hasNext,
  };
}

// 공용 호출기: endpoint + params → StellarListPage
async function fetchStellarListPaged(
  url: string,
  params: ParamsGetStellarList
): Promise<StellarListPage> {
  const response = await axiosInstance.get<StellarListResponse>(url, {
    params,
  });
  return adaptStellarList(response.data);
}

export const stellarListAPI = {
  // 스텔라 리스트 - COMMUNITY 목록
  getStellarListList: (params: ParamsGetStellarList) =>
    fetchStellarListPaged(endpoints.stellarList.base, params),

  // 스텔라 리스트 - MY 목록 (rank_type 미사용)
  getStellarMyList: (params: ParamsGetStellarList) =>
    fetchStellarListPaged(endpoints.stellarList.my, params),

  // 갤럭시 - 모든 스텔라 목록 조회 (그대로)
  getAllStellarList: async (params: ParamsGetAllStellarList) => {
    // 실제 API 호출 (나중에 활성화)
    const response = await axiosInstance.get<GalaxyAllStellarListResponse>(
      endpoints.stellarList.all(params.galaxyId),
      { params }
    );
    return response.data;
  },
};
