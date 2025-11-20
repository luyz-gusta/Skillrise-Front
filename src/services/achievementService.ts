import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Achievement {
  achievementId: number;
  userId: number;
  tipo: string;
  nome: string;
  descricao: string;
  icone: string;
  xpGanho: number;
  dataConquista: string;
  raridade: string;
}

export const achievementService = {
  findByUserId: async (userId: number): Promise<Achievement[]> => {
    const response = await api.get<ApiListResponse<Achievement>>(`/achievements/user/${userId}`);
    return response.data.data;
  },

  findByTipo: async (userId: number, tipo: string): Promise<Achievement[]> => {
    const response = await api.get<ApiListResponse<Achievement>>(
      `/achievements/user/${userId}/tipo/${tipo}`
    );
    return response.data.data;
  },

  verificarNovasConquistas: async (userId: number): Promise<Achievement[]> => {
    const response = await api.post<ApiListResponse<Achievement>>(`/achievements/verificar/${userId}`);
    return response.data.data;
  },

  contarPorUsuario: async (userId: number): Promise<number> => {
    const response = await api.get<ApiSingleResponse<number>>(`/achievements/user/${userId}/count`);
    return response.data.data;
  },
};
