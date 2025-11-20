import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Notificacao {
  notificacaoId: number;
  userId: number;
  titulo: string;
  mensagem: string;
  tipo: string;
  icone?: string;
  link?: string;
  lida: boolean;
  criadaEm: string;
}

export interface NotificacaoRequest {
  userId: number;
  titulo: string;
  mensagem: string;
  tipo?: string;
  icone?: string;
  link?: string;
}

export const notificacaoService = {
  findByUserId: async (userId: number): Promise<Notificacao[]> => {
    const response = await api.get<ApiListResponse<Notificacao>>(`/notificacoes/user/${userId}`);
    return response.data.data;
  },

  findNaoLidas: async (userId: number): Promise<Notificacao[]> => {
    const response = await api.get<ApiListResponse<Notificacao>>(
      `/notificacoes/user/${userId}/nao-lidas`
    );
    return response.data.data;
  },

  contarNaoLidas: async (userId: number): Promise<number> => {
    const response = await api.get<ApiSingleResponse<number>>(`/notificacoes/user/${userId}/count`);
    return response.data.data;
  },

  marcarComoLida: async (notificacaoId: number): Promise<void> => {
    await api.put(`/notificacoes/${notificacaoId}/ler`);
  },

  marcarTodasComoLidas: async (userId: number): Promise<void> => {
    await api.put(`/notificacoes/user/${userId}/ler-todas`);
  },

  criar: async (request: NotificacaoRequest): Promise<Notificacao> => {
    const response = await api.post<ApiSingleResponse<Notificacao>>('/notificacoes', request);
    return response.data.data;
  },

  deletar: async (notificacaoId: number): Promise<void> => {
    await api.delete(`/notificacoes/${notificacaoId}`);
  },
};
