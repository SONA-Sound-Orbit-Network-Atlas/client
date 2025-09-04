import axiosInstance from '@/lib/axios';
import type { STAR, PLANET } from '@/types/system';

export const systemAPI = {
  // 별+행성 목록 조회
  getPlanetList: async (galaxyId: number): Promise<(STAR | PLANET)[]> => {
    const response = await axiosInstance.get<STAR & PLANET[]>(
      `/systems/${galaxyId}/planets`
    );
    return response.data;
  },

  // 별 정보 조회
  getStarInfo: async (galaxyId: number): Promise<STAR> => {
    const response = await axiosInstance.get<STAR>(`/systems/${galaxyId}/star`);
    return response.data;
  },
  // 행성 정보 조회
  getPlanetInfo: async (
    galaxyId: number,
    planetNo: number
  ): Promise<PLANET> => {
    const response = await axiosInstance.get<PLANET>(
      `/systems/${galaxyId}/planets/${planetNo}`
    );
    return response.data;
  },
};
