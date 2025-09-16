import axiosInstance from '@/lib/axios';
import type { StellarType } from '@/types/stellar';
import { getStellarSystemMock } from '@/mocks/data/stellarSystems';

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
  getStellar: async (stellarId: string): Promise<StellarType> => {
    // const response = await axiosInstance.get<StellarType>(
    //   `/stellarSystems/${stellarId}`
    // );
    const response = getStellarSystemMock(stellarId) as StellarType;
    return response;
    // return response.data;
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
