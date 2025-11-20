import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface User {
  userId: number;
  id?: number; // Mantido para compatibilidade
  name: string;
  email: string;
  role: string;
  goal?: string;
  level: number;
  badges: number;
  streak: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, goal?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verificar se há usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("skillrise_user");
    const token = localStorage.getItem("skillrise_token");
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // Salvar token
      localStorage.setItem("skillrise_token", response.data.token);
      
      // Criar objeto de usuário
      const userData: User = {
        id: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        level: 1, // Valores padrão - podem ser obtidos de outro endpoint
        badges: 0,
        streak: 0,
      };
      
      setUser(userData);
      localStorage.setItem("skillrise_user", JSON.stringify(userData));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${userData.name}!`,
      });
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.response?.data?.message || "Email ou senha incorretos",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, goal?: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register({ name, email, password });
      
      // Salvar token
      localStorage.setItem("skillrise_token", response.data.token);
      
      // Criar objeto de usuário
      const userData: User = {
        id: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        goal,
        level: 1,
        badges: 0,
        streak: 0,
      };
      
      setUser(userData);
      localStorage.setItem("skillrise_user", JSON.stringify(userData));
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua conta foi criada. Bem-vindo ao SkillRise 2030+!",
      });
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.response?.data?.message || "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    toast({
      title: "Logout realizado",
      description: "Até a próxima!",
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
