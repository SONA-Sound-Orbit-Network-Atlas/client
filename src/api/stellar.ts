import axiosInstance from '@/lib/axios';
import type { StellarSystem } from '@/types/stellar';
import { endpoints } from './endpoints';
import type { StellarWritePayload } from '@/types/stellarWrite';

// stellar API
export const stellarAPI = {
  // 조회
  getStellar: async (stellarId: string): Promise<StellarSystem> => {
    const response = await axiosInstance.get<StellarSystem>(
      endpoints.stellarSystem.byId(stellarId)
    );
    return response.data;
  },

  // 생성: 공용 페이로드 사용
  createStellar: async (
    payload: StellarWritePayload
  ): Promise<StellarSystem> => {
    const res = await axiosInstance.post<StellarSystem>(
      endpoints.stellarSystem.base,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
  },

  // 수정: 공용 페이로드 사용
  updateStellar: async (
    stellarId: string,
    payload: StellarWritePayload
  ): Promise<StellarSystem> => {
    const res = await axiosInstance.put<StellarSystem>(
      endpoints.stellarSystem.byId(stellarId),
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
  },

  // 삭제
  deleteStellar: async (stellarId: string): Promise<void> => {
    await axiosInstance.delete(endpoints.stellarSystem.byId(stellarId));
  },

  // 클론
  cloneStellar: async (stellarId: string): Promise<StellarSystem> => {
    const res = await axiosInstance.post(endpoints.stellarSystem.clone, {
      create_source_id: stellarId,
    });
    return res.data;
  },
};
