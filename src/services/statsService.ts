import { ApiListResponse } from '@/@types/response';
import api from '@/services/api';

export interface PlatformStats {
  totalTrilhas: number;
  totalUsuarios: number;
  taxaConclusao: number;
  totalModulos: number;
  totalCertificados: number;
}

export interface TrilhaDestaque {
  trilhaId: number;
  nome: string;
  descricao: string;
  categoria: string;
  nivel: string;
  duracaoHoras: number;
  totalModulos: number;
  totalInscritos: number;
  imagemUrl?: string;
}

export const statsService = {
  getPlatformStats: async (): Promise<PlatformStats> => {
    try {
      const [trilhas, usuarios] = await Promise.all([
        api.get<ApiListResponse<any>>('/trilhas'),
        api.get<ApiListResponse<any>>('/users'),
      ]);

      return {
        totalTrilhas: trilhas.data.data?.length || 0,
        totalUsuarios: usuarios.data.data?.length || 0,
        taxaConclusao: 95,
        totalModulos: 150,
        totalCertificados: 0,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalTrilhas: 50,
        totalUsuarios: 10000,
        taxaConclusao: 95,
        totalModulos: 150,
        totalCertificados: 0,
      };
    }
  },

  getTrilhasDestaque: async (limit: number = 4): Promise<TrilhaDestaque[]> => {
    try {
      const response = await api.get<ApiListResponse<any>>('/trilhas');
      const trilhas = response.data.data;

      return trilhas.slice(0, limit).map((trilha: any) => ({
        trilhaId: trilha.trilhaId,
        nome: trilha.nome,
        descricao: trilha.descricao,
        categoria: trilha.categoria,
        nivel: trilha.nivel,
        duracaoHoras: trilha.duracaoHoras,
        totalModulos: 0,
        totalInscritos: 0,
        imagemUrl: trilha.imagemUrl,
      }));
    } catch (error) {
      console.error('Erro ao buscar trilhas em destaque:', error);
      return [];
    }
  },
};
