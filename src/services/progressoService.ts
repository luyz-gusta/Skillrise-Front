import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Progresso {
  progressoId: number;
  inscricaoId: number;
  moduloId: number;
  moduloTitle: string;
  percentage: number;
  lastAccess: string;
}

export interface ProgressoUpdateRequest {
  percentage: number;
}

export const progressoService = {
  updateProgress: async (
    inscricaoId: number,
    moduloId: number,
    percentage: number
  ): Promise<Progresso> => {
    const response = await api.put<ApiSingleResponse<Progresso>>(
      `/progresso?inscricaoId=${inscricaoId}&moduloId=${moduloId}`,
      { percentage }
    );
    return response.data.data;
  },

  findByInscricaoId: async (inscricaoId: number): Promise<Progresso[]> => {
    const response = await api.get<ApiListResponse<Progresso>>(
      `/progresso/inscricao/${inscricaoId}`
    );
    return response.data.data;
  },
};
