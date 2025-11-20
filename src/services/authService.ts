import api from '@/services/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface AuthResponse {
  data: {
    token: string;
    type: string;
    userId: number;
    name: string;
    email: string;
    role: string;
  };
  message: string;
  status: number;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('skillrise_token');
    localStorage.removeItem('skillrise_user');
  },
};
