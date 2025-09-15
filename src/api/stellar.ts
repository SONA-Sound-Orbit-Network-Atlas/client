import axiosInstance from '@/lib/axios';
import type { StellarSystem } from '@/types/stellar';

// stellar API
export const stellarAPI = {
  // 생성
  createStellar: async (stellarData: StellarSystem): Promise<StellarSystem> => {
    const response = await axiosInstance.post<StellarSystem>(
      '/api/stellar-systems/compose',
      stellarData
    );
    return response.data;
  },

  // 조회
  getStellar: async (stellarId: string): Promise<StellarSystem> => {
    const response = await axiosInstance.get<StellarSystem>(
      `/api/stellar-systems/compose/${stellarId}`
    );
    return response.data;
  },

  // 수정
  updateStellar: async (
    stellarId: string,
    stellarData: StellarSystem
  ): Promise<StellarSystem> => {
    const response = await axiosInstance.put<StellarSystem>(
      `/api/stellarSystems/${stellarId}`,
      stellarData
    );
    return response.data;
  },

  // 삭제
  deleteStellar: async (stellarId: string): Promise<void> => {
    await axiosInstance.delete(`/api/stellarSystems/${stellarId}`);
  },
};
