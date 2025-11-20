import { ApiListResponse } from '@/@types/response';
import api from '@/services/api';
import { Trilha } from '@/services/trilhaService';

export interface PlatformStats {
  totalTrilhas: number;
  totalUsuarios: number;
  taxaConclusao: number;
  totalModulos: number;
  totalCertificados: number;
}


export const getPlatformStats = async (): Promise<PlatformStats> => {
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
};

export const getTrilhasDestaque = async (limit: number = 4): Promise<Trilha[]> => {
  try {
    const response = await api.get<ApiListResponse<any>>('/trilhas');
    console.log('Resposta da API /trilhas:', response.data);
    
    const trilhas = response.data.data || response.data;

    if (!trilhas || !Array.isArray(trilhas) || trilhas.length === 0) {
      console.warn('Nenhuma trilha retornada da API, usando dados mock');
      return getMockTrilhas(limit);
    }

    console.log('Trilhas recebidas:', trilhas);

    // Mapear para o formato esperado pela Index.tsx
    const trilhasResponse = trilhas.slice(0, limit).map((trilha: any) => ({
      trilhaId: trilha.trilhaId,
      title: trilha.title || trilha.nome,
      description: trilha.description || trilha.descricao,
      difficulty: trilha.difficulty || trilha.nivel,
      durationHours: trilha.durationHours || trilha.duracaoHoras,
      imageUrl: trilha.imageUrl || trilha.imagemUrl,
      createdAt: trilha.createdAt || new Date().toISOString(),
    }));

    console.log('Trilhas mapeadas:', trilhasResponse);

    return trilhasResponse;
  } catch (error) {
    console.error('Erro ao buscar trilhas em destaque:', error);
    console.log('Usando dados mock como fallback');
    return getMockTrilhas(limit);
  }
};

// Dados mock para desenvolvimento/fallback
const getMockTrilhas = (limit: number): Trilha[] => {
  const mockTrilhas: Trilha[] = [
    {
      trilhaId: 1,
      title: "Inteligência Artificial & Machine Learning",
      description: "Domine os fundamentos de IA, Machine Learning e Deep Learning para criar soluções inteligentes",
      difficulty: "Intermediário",
      durationHours: 80,
      imageUrl: undefined,
      createdAt: new Date().toISOString(),
    },
    {
      trilhaId: 2,
      title: "Ciência de Dados & Analytics",
      description: "Aprenda a extrair insights valiosos dos dados usando Python, SQL e ferramentas de visualização",
      difficulty: "Iniciante",
      durationHours: 60,
      imageUrl: undefined,
      createdAt: new Date().toISOString(),
    },
    {
      trilhaId: 3,
      title: "Soft Skills para Liderança",
      description: "Desenvolva habilidades essenciais de comunicação, gestão de conflitos e liderança de equipes",
      difficulty: "Intermediário",
      durationHours: 40,
      imageUrl: undefined,
      createdAt: new Date().toISOString(),
    },
    {
      trilhaId: 4,
      title: "Sustentabilidade & ESG",
      description: "Entenda práticas sustentáveis e como implementar estratégias ESG nas organizações",
      difficulty: "Iniciante",
      durationHours: 32,
      imageUrl: undefined,
      createdAt: new Date().toISOString(),
    },
    {
      trilhaId: 5,
      title: "Cybersegurança Essencial",
      description: "Proteja sistemas e dados com técnicas avançadas de segurança da informação",
      difficulty: "Avançado",
      durationHours: 72,
      imageUrl: undefined,
      createdAt: new Date().toISOString(),
    },
    {
      trilhaId: 6,
      title: "Marketing Digital & Growth",
      description: "Estratégias modernas de marketing digital, SEO, mídias sociais e growth hacking",
      difficulty: "Intermediário",
      durationHours: 56,
      imageUrl: undefined,
      createdAt: new Date().toISOString(),
    },
  ];

  return mockTrilhas.slice(0, limit);
};

export const statsService = {
  getPlatformStats,
  getTrilhasDestaque,
};
