import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface User {
  userId: number;
  name: string;
  email: string;
  birthDate: string;
  role: string;
  createdAt: string;
  xp?: number;
  level?: number;
  streakDias?: number;
  ultimoAcesso?: string;
}

export interface UserStats {
  userId: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  xpProximoLevel: number;
  streakDias: number;
  ultimoAcesso: string;
  totalInscricoes: number;
  trilhasCompletas: number;
  modulosCompletos: number;
  totalCertificados: number;
  totalAchievements: number;
  taxaConclusao: number;
}

export const userService = {
  findById: async (id: number): Promise<User> => {
    const response = await api.get<ApiSingleResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  findAll: async (): Promise<User[]> => {
    const response = await api.get<ApiListResponse<User>>('/users');
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getStats: async (id: number): Promise<UserStats> => {
    const response = await api.get<ApiSingleResponse<UserStats>>(`/users/${id}/stats`);
    return response.data.data;
  },
};
