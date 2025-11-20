import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Meta {
  metaId: number;
  userId: number;
  titulo: string;
  descricao?: string;
  tipo: string;
  targetValue: number;
  currentValue: number;
  progresso: number;
  prazo?: string;
  status: string;
  criadaEm: string;
  concluidaEm?: string;
}

export interface MetaRequest {
  userId: number;
  titulo: string;
  descricao?: string;
  tipo: string;
  targetValue: number;
  prazo?: string;
}

export const metaService = {
  findByUserId: async (userId: number): Promise<Meta[]> => {
    const response = await api.get<ApiListResponse<Meta>>(`/metas/user/${userId}`);
    return response.data.data;
  },

  findAtivas: async (userId: number): Promise<Meta[]> => {
    const response = await api.get<ApiListResponse<Meta>>(`/metas/user/${userId}/ativas`);
    return response.data.data;
  },

  findById: async (metaId: number): Promise<Meta> => {
    const response = await api.get<ApiSingleResponse<Meta>>(`/metas/${metaId}`);
    return response.data.data;
  },

  criar: async (request: MetaRequest): Promise<Meta> => {
    const response = await api.post<ApiSingleResponse<Meta>>('/metas', request);
    return response.data.data;
  },

  atualizar: async (metaId: number, request: MetaRequest): Promise<Meta> => {
    const response = await api.put<ApiSingleResponse<Meta>>(`/metas/${metaId}`, request);
    return response.data.data;
  },

  atualizarProgresso: async (metaId: number, incremento: number): Promise<Meta> => {
    const response = await api.put<ApiSingleResponse<Meta>>(`/metas/${metaId}/progresso`, { incremento });
    return response.data.data;
  },

  deletar: async (metaId: number): Promise<void> => {
    await api.delete(`/metas/${metaId}`);
  },

  contarAtivas: async (userId: number): Promise<number> => {
    const response = await api.get<ApiSingleResponse<number>>(`/metas/user/${userId}/count-ativas`);
    return response.data.data;
  },
};
