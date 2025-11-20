import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Vaga {
  vagaId: number;
  titulo: string;
  empresaId: number;
  empresaNome?: string;
  empresaLogo?: string;
  descricao: string;
  salarioMin?: number;
  salarioMax?: number;
  localizacao?: string;
  tipoContrato?: string;
  nivel?: string;
  trilhaId?: number;
  trilhaNome?: string;
  criadaEm: string;
  status: string;
}

export interface VagaPorTrilha {
  vagaId: number;
  titulo: string;
  empresaNome: string;
  salarioMin?: number;
  salarioMax?: number;
  nivel?: string;
}

export const vagaService = {
  findAll: async (): Promise<Vaga[]> => {
    const response = await api.get<ApiListResponse<Vaga>>('/vagas');
    return response.data.data;
  },

  findById: async (id: number): Promise<Vaga> => {
    const response = await api.get<ApiSingleResponse<Vaga>>(`/vagas/${id}`);
    return response.data.data;
  },

  findByTrilhaId: async (trilhaId: number): Promise<VagaPorTrilha[]> => {
    try {
      const response = await api.get<ApiListResponse<VagaPorTrilha>>(`/vagas/trilha/${trilhaId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar vagas da trilha:', error);
      return [];
    }
  },

  findByEmpresaId: async (empresaId: number): Promise<Vaga[]> => {
    const response = await api.get<ApiListResponse<Vaga>>(`/vagas/empresa/${empresaId}`);
    return response.data.data;
  },

  findAtivas: async (): Promise<Vaga[]> => {
    const response = await api.get<ApiListResponse<Vaga>>('/vagas/status/ATIVA');
    return response.data.data;
  },
};
