import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Trilha {
  trilhaId: number;
  title: string;
  description: string;
  difficulty: string;
  durationHours: number;
  imageUrl?: string;
  createdAt: string;
}

export interface TrilhaRequest {
  title: string;
  description: string;
  difficulty: string;
  durationHours: number;
  imageUrl?: string;
}

export const trilhaService = {
  findAll: async (): Promise<Trilha[]> => {
    const response = await api.get<ApiListResponse<Trilha>>('/trilhas');
    return response.data.data;
  },

  findById: async (id: number): Promise<Trilha> => {
    const response = await api.get<ApiSingleResponse<Trilha>>(`/trilhas/${id}`);
    return response.data.data;
  },

  create: async (trilha: TrilhaRequest): Promise<Trilha> => {
    const response = await api.post<ApiSingleResponse<Trilha>>('/trilhas', trilha);
    return response.data.data;
  },

  update: async (id: number, trilha: TrilhaRequest): Promise<Trilha> => {
    const response = await api.put<ApiSingleResponse<Trilha>>(`/trilhas/${id}`, trilha);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/trilhas/${id}`);
  },
};
