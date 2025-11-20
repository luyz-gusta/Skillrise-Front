import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Mail, Lock, User, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupGoal, setSignupGoal] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à SkillRise 2030+",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(signupName, signupEmail, signupPassword, signupGoal);
      toast({
        title: "Conta criada com sucesso!",
        description: "Sua jornada de aprendizado começa agora.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary))_0%,transparent_50%)] opacity-10 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--secondary))_0%,transparent_50%)] opacity-10 -z-10" />

      <Card className="w-full max-w-md p-8 shadow-[var(--shadow-elevated)] border-border/50">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:shadow-[var(--glow-primary)] transition-all">
            <Rocket className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillRise
            </span>
            <span className="text-xs text-muted-foreground">2030+</span>
          </div>
        </Link>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[var(--glow-primary)] transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center">
                <button type="button" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Esqueceu sua senha?
                </button>
              </div>
            </form>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome"
                    className="pl-10"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-goal">Objetivo Profissional</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-goal"
                    type="text"
                    placeholder="Ex: Cientista de Dados"
                    className="pl-10"
                    value={signupGoal}
                    onChange={(e) => setSignupGoal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[var(--glow-primary)] transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade.
              </p>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Voltar para home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
