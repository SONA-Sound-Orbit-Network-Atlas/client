import axiosInstance from '@/lib/axios';
import type { StellarSystem } from '@/types/stellar';
import { endpoints } from './endpoints';

// stellar API
export const stellarAPI = {
  // 조회
  getStellar: async (stellarId: string): Promise<StellarSystem> => {
    const response = await axiosInstance.get<StellarSystem>(
      endpoints.stellarSystem.byId(stellarId)
    );
    return response.data;
  },

  // 생성
  createStellar: async (stellarData: StellarSystem): Promise<StellarSystem> => {
    const response = await axiosInstance.post<StellarSystem>(
      endpoints.stellarSystem.base,
      stellarData
    );
    return response.data;
  },

  // 수정
  updateStellar: async (
    stellarId: string,
    stellarData: StellarSystem
  ): Promise<StellarSystem> => {
    const response = await axiosInstance.put<StellarSystem>(
      endpoints.stellarSystem.byId(stellarId),
      stellarData
    );
    return response.data;
  },

  // 삭제
  deleteStellar: async (stellarId: string): Promise<void> => {
    await axiosInstance.delete(endpoints.stellarSystem.byId(stellarId));
  },
};
