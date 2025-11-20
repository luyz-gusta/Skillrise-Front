import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Modulo {
  moduloId: number;
  title: string;
  description?: string;
  durationMinutes: number;
  contentType: string;
  createdAt: string;
}

export interface ModuloRequest {
  title: string;
  durationMinutes: number;
  contentType: string;
  trilhaId: number;
}

export const moduloService = {
  findAll: async (): Promise<Modulo[]> => {
    const response = await api.get<ApiListResponse<Modulo>>('/modulos');
    return response.data.data;
  },

  findById: async (id: number): Promise<Modulo> => {
    const response = await api.get<ApiSingleResponse<Modulo>>(`/modulos/${id}`);
    return response.data.data;
  },

  findByTrilhaId: async (trilhaId: number): Promise<Modulo[]> => {
    const response = await api.get<ApiListResponse<Modulo>>(`/modulos/trilha/${trilhaId}`);
    return response.data.data;
  },

  create: async (modulo: ModuloRequest): Promise<Modulo> => {
    const response = await api.post<ApiSingleResponse<Modulo>>('/modulos', modulo);
    return response.data.data;
  },

  update: async (id: number, modulo: ModuloRequest): Promise<Modulo> => {
    const response = await api.put<ApiSingleResponse<Modulo>>(`/modulos/${id}`, modulo);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/modulos/${id}`);
  },
};
