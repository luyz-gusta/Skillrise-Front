import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';


export interface Inscricao {
  inscricaoId: number;
  userId: number;
  trilhaId: number;
  trilhaTitle: string;
  enrolledAt: string;
  status: string;
}

export const inscricaoService = {
  enrollUser: async (userId: number, trilhaId: number): Promise<Inscricao> => {
    const response = await api.post<ApiSingleResponse<Inscricao>>(
      `/inscricoes?userId=${userId}&trilhaId=${trilhaId}`
    );
    return response.data.data;
  },

  findByUserId: async (userId: number): Promise<Inscricao[]> => {
    const response = await api.get<ApiListResponse<Inscricao>>(`/inscricoes/user/${userId}`);
    return response.data.data;
  },

  findByTrilhaId: async (trilhaId: number): Promise<Inscricao[]> => {
    const response = await api.get<ApiListResponse<Inscricao>>(`/inscricoes/trilha/${trilhaId}`);
    return response.data.data;
  },
};
