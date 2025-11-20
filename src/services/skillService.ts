import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Skill {
  skillId: number;
  name: string;
  description: string;
}

export interface SkillRequest {
  name: string;
  description: string;
}

export const skillService = {
  findAll: async (): Promise<Skill[]> => {
    const response = await api.get<ApiListResponse<Skill>>('/skills');
    return response.data.data;
  },

  findById: async (id: number): Promise<Skill> => {
    const response = await api.get<ApiSingleResponse<Skill>>(`/skills/${id}`);
    return response.data.data;
  },

  create: async (skill: SkillRequest): Promise<Skill> => {
    const response = await api.post<ApiSingleResponse<Skill>>('/skills', skill);
    return response.data.data;
  },

  update: async (id: number, skill: SkillRequest): Promise<Skill> => {
    const response = await api.put<ApiSingleResponse<Skill>>(`/skills/${id}`, skill);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/skills/${id}`);
  },
};
