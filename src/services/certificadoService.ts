import { ApiListResponse, ApiSingleResponse } from '@/@types/response';
import api from '@/services/api';

export interface Certificado {
  certificadoId: number;
  userId: number;
  userName: string;
  trilhaId: number;
  trilhaTitle: string;
  codigo: string;
  dataEmissao: string;
  validadeAnos: number;
  pdfUrl?: string;
  status: string;
}

export const certificadoService = {
  findByUserId: async (userId: number): Promise<Certificado[]> => {
    const response = await api.get<ApiListResponse<Certificado>>(`/certificados/user/${userId}`);
    return response.data.data;
  },

  findByCodigo: async (codigo: string): Promise<Certificado> => {
    const response = await api.get<ApiSingleResponse<Certificado>>(`/certificados/codigo/${codigo}`);
    return response.data.data;
  },

  findById: async (id: number): Promise<Certificado> => {
    const response = await api.get<ApiSingleResponse<Certificado>>(`/certificados/${id}`);
    return response.data.data;
  },

  findByStatus: async (userId: number, status: string): Promise<Certificado[]> => {
    const response = await api.get<ApiListResponse<Certificado>>(
      `/certificados/user/${userId}/status/${status}`
    );
    return response.data.data;
  },

  gerarCertificado: async (inscricaoId: number): Promise<Certificado> => {
    const response = await api.post<ApiSingleResponse<Certificado>>(
      `/certificados/inscricao/${inscricaoId}`
    );
    return response.data.data;
  },
};
