import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ModuloCard } from "@/components/ModuloCard";
import { useStaggerAnimation, useFadeIn } from "@/hooks/useGsapAnimations";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trilhaService } from "@/services/trilhaService";
import { moduloService } from "@/services/moduloService";
import { inscricaoService } from "@/services/inscricaoService";
import { progressoService } from "@/services/progressoService";
import { vagaService } from "@/services/vagaService";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAchievementNotifications, useCreateNotification } from "@/hooks/useNotifications";
import {
  Brain,
  Clock,
  BookOpen,
  ArrowRight,
  Award,
  Briefcase,
  AlertCircle,
  Loader2,
  Share2,
} from "lucide-react";
import aiImage from "@/assets/ai-automation-bg.jpg";

const TrilhaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const heroRef = useFadeIn();
  const modulosRef = useStaggerAnimation();
  const sidebarRef = useFadeIn();
  
  // Hooks de notificações
  const { checkForNewAchievements } = useAchievementNotifications();
  const { createNotification } = useCreateNotification();

  // Buscar dados da trilha
  const { data: trilha, isLoading: isLoadingTrilha, isError: isErrorTrilha } = useQuery({
    queryKey: ['trilha', id],
    queryFn: () => trilhaService.findById(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar módulos da trilha
  const { data: modulosData, isLoading: isLoadingModulos } = useQuery({
    queryKey: ['modulos', id],
    queryFn: () => moduloService.findByTrilhaId(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar inscrição do usuário (se estiver logado)
  const { data: inscricoes, refetch: refetchInscricoes } = useQuery({
    queryKey: ['inscricoes', user?.id],
    queryFn: () => inscricaoService.findByUserId(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Mutation para inscrever usuário
  const enrollMutation = useMutation({
    mutationFn: ({ userId, trilhaId }: { userId: number; trilhaId: number }) => 
      inscricaoService.enrollUser(userId, trilhaId),
    onSuccess: async (data, variables) => {
      toast({
        title: "Inscrição realizada!",
        description: "Você foi inscrito na trilha com sucesso.",
      });
      
      // Criar notificação de boas-vindas
      await createNotification(
        `Bem-vindo à trilha ${trilha?.title || 'de aprendizado'}! Comece sua jornada agora.`,
        'INFO'
      );
      
      // Invalidar cache e recarregar inscrições
      queryClient.invalidateQueries({ queryKey: ['inscricoes', user?.id] });
      refetchInscricoes();
      setIsEnrolling(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao inscrever",
        description: error.response?.data?.message || "Não foi possível realizar a inscrição. Tente novamente.",
        variant: "destructive",
      });
      setIsEnrolling(false);
    },
  });

  // Handler para inscrição
  const handleEnroll = async () => {
    if (!user || !id) return;
    
    setIsEnrolling(true);
    enrollMutation.mutate({ 
      userId: user.id, 
      trilhaId: Number(id) 
    });
  };

  // State para controlar qual módulo está sendo atualizado
  const [updatingModuloId, setUpdatingModuloId] = useState<number | null>(null);

  // Mutation para atualizar progresso
  const updateProgressMutation = useMutation({
    mutationFn: async ({ inscricaoId, moduloId }: { inscricaoId: number; moduloId: number }) => {
      try {
        return await progressoService.updateProgress(inscricaoId, moduloId, 100);
      } catch (error: any) {
        // Se o progresso já existe com 100%, considerar sucesso
        if (error.response?.status === 500) {
          console.warn('Erro ao atualizar progresso, mas continuando:', error.response?.data);
          return null;
        }
        throw error;
      }
    },
    onSuccess: async () => {
      toast({
        title: "Módulo concluído!",
        description: "Parabéns! Continue sua jornada.",
      });
      
      // Verificar novas conquistas após completar módulo
      try {
        await checkForNewAchievements();
      } catch (error) {
        console.error('Erro ao verificar conquistas:', error);
      }
      
      // Invalidar cache do progresso
      queryClient.invalidateQueries({ queryKey: ['progresso', inscricao?.inscricaoId] });
      queryClient.invalidateQueries({ queryKey: ['inscricoes', user?.id] });
      setUpdatingModuloId(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Não foi possível marcar como concluído.";
      toast({
        title: "Erro ao atualizar progresso",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Erro completo:', error);
      setUpdatingModuloId(null);
    },
  });

  // Handler para completar módulo
  const handleCompleteModulo = (moduloId: number) => {
    if (!inscricao) return;
    
    setUpdatingModuloId(moduloId);
    updateProgressMutation.mutate({
      inscricaoId: inscricao.inscricaoId,
      moduloId,
    });
  };

  // Handler para compartilhar trilha
  const handleCompartilhar = async () => {
    if (!trilha) return;

    const url = window.location.href;
    const texto = `Confira a trilha "${trilha.title}" no SkillRise 2030! ${url}`;

    // Tentar usar Web Share API (mobile/navegadores modernos)
    if (navigator.share) {
      try {
        await navigator.share({
          title: trilha.title,
          text: `${trilha.description}`,
          url: url,
        });
        toast({
          title: "Compartilhado com sucesso!",
        });
      } catch (error) {
        // Usuário cancelou ou erro
        if ((error as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error);
        }
      }
    } else {
      // Fallback: copiar link para clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "O link da trilha foi copiado para a área de transferência.",
        });
      } catch (error) {
        toast({
          title: "Erro ao copiar link",
          description: "Não foi possível copiar o link.",
          variant: "destructive",
        });
      }
    }
  };

  // Verificar se usuário está inscrito nesta trilha
  const inscricao = useMemo(() => {
    if (!inscricoes || !id) return null;
    return inscricoes.find(i => i.trilhaId === Number(id));
  }, [inscricoes, id]);

  // Buscar progresso do usuário (se estiver inscrito)
  const { data: progressoData } = useQuery({
    queryKey: ['progresso', inscricao?.inscricaoId],
    queryFn: () => progressoService.findByInscricaoId(inscricao!.inscricaoId),
    enabled: !!inscricao?.inscricaoId,
    staleTime: 1 * 60 * 1000,
  });

  // Buscar vagas relacionadas à trilha
  const { data: vagas = [] } = useQuery({
    queryKey: ['vagas', id],
    queryFn: () => vagaService.findByTrilhaId(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Calcular progresso geral
  const progressoGeral = useMemo(() => {
    if (!progressoData || !modulosData || modulosData.length === 0) return 0;
    const totalModulos = modulosData.length;
    const modulosConcluidos = progressoData.filter(p => p.percentage === 100).length;
    return Math.round((modulosConcluidos / totalModulos) * 100);
  }, [progressoData, modulosData]);

  // Mapear módulos com informações de progresso
  const modulos = useMemo(() => {
    if (!modulosData) return [];
    
    return modulosData.map((modulo, index) => {
      const progresso = progressoData?.find(p => p.moduloId === modulo.moduloId);
      const completed = progresso?.percentage === 100;
      const modulosCompletados = progressoData?.filter(p => p.percentage === 100).length || 0;
      
      return {
        id: modulo.moduloId,
        title: modulo.title,
        aulas: 8, // Placeholder - ajustar se tiver no backend
        duration: `${modulo.durationMinutes} min`,
        completed,
        locked: inscricao ? index > modulosCompletados : false,
        current: inscricao && index === modulosCompletados && !completed,
      };
    });
  }, [modulosData, progressoData, inscricao]);

  // Competências mockadas (pode criar endpoint específico depois)
  const competencias = [
    "Machine Learning",
    "Deep Learning",
    "Python",
    "TensorFlow",
    "PyTorch",
    "Análise de Dados",
    "Modelagem Preditiva",
    "MLOps",
  ];



  // Loading state
  if (isLoadingTrilha || isLoadingModulos) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Carregando trilha...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isErrorTrilha || !trilha) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="p-8 border-destructive/50">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Erro ao carregar trilha</h3>
                  <p className="text-sm">Trilha não encontrada ou erro no servidor.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/trilhas')} className="mt-4">
                Voltar para Trilhas
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mapear dificuldade
  const difficultyLabel = trilha.difficulty === "INICIANTE" ? "Iniciante" :
                          trilha.difficulty === "INTERMEDIARIO" ? "Intermediário" : "Avançado";
  
  const difficultyColor = trilha.difficulty === "INICIANTE" ? "bg-success/10 text-success border-success/20" :
                          trilha.difficulty === "INTERMEDIARIO" ? "bg-warning/10 text-warning border-warning/20" : 
                          "bg-destructive/10 text-destructive border-destructive/20";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero Section */}
          <div ref={heroRef} className="grid lg:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <Badge className={difficultyColor}>
                    {difficultyLabel}
                  </Badge>
                  <h1 className="text-4xl font-bold uppercase">{trilha.title}</h1>
                </div>
              </div>

              <p className="text-lg text-muted-foreground">
                {trilha.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{Math.ceil(trilha.durationHours / 4)} semanas</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{modulos.length} módulos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Certificado incluído</span>
                </div>
              </div>

              {inscricao && (
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seu progresso</span>
                    <span className="font-semibold">{progressoGeral}%</span>
                  </div>
                  <Progress value={progressoGeral} className="h-2" />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {inscricao ? (
                  <Button 
                    size="lg"
                    onClick={() => {
                      const moduloAtual = modulos.find(m => m.current && !m.completed) || modulos[0];
                      if (moduloAtual) {
                        navigate(`/trilhas/${id}/modulos/${moduloAtual.id}`);
                      }
                    }}
                  >
                    Continuar Aprendendo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    disabled={!user || isEnrolling}
                    onClick={handleEnroll}
                  >
                    {isEnrolling && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {user ? (isEnrolling ? 'Inscrevendo...' : 'Inscrever-se na Trilha') : 'Faça login para se inscrever'}
                    {!isEnrolling && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={handleCompartilhar}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Compartilhar
                </Button>
              </div>
            </div>

            <div className="aspect-video rounded-lg overflow-hidden border border-border">
              <img
                src={trilha.imageUrl || aiImage}
                alt={trilha.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Modules List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold uppercase">Módulos</h2>
              
              <div ref={modulosRef} className="space-y-3">
                {modulos.map((modulo) => (
                  <ModuloCard 
                    key={modulo.id} 
                    {...modulo}
                    trilhaId={Number(id)}
                    inscricaoId={inscricao?.inscricaoId}
                    onComplete={handleCompleteModulo}
                    isUpdating={updatingModuloId === modulo.id}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div ref={sidebarRef} className="space-y-8">
              {/* Competências */}
              <div>
                <h3 className="text-xl font-bold mb-4 uppercase">Competências</h3>
                <Card className="p-6 border-border">
                  <div className="flex flex-wrap gap-2">
                    {competencias.map((comp, index) => (
                      <Badge key={index} variant="secondary">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Oportunidades */}
              {vagas.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 uppercase">Oportunidades</h3>
                <div className="space-y-3">
                  {vagas.map((vaga) => {
                    const salarioText = vaga.salarioMin && vaga.salarioMax
                      ? `R$ ${(vaga.salarioMin / 1000).toFixed(0)}k - R$ ${(vaga.salarioMax / 1000).toFixed(0)}k`
                      : 'Salário a combinar';
                    
                    return (
                      <Card key={vaga.vagaId} className="p-4 border-border hover:border-primary/50 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{vaga.titulo}</p>
                              <p className="text-xs text-muted-foreground">{vaga.empresaNome}</p>
                              {vaga.nivel && (
                                <Badge variant="outline" className="mt-1 text-xs">{vaga.nivel}</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-primary">{salarioText}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Certificate */}
              <Card className="p-6 border-border">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto">
                    <Award className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="font-semibold">Certificado Digital</p>
                    <p className="text-xs text-muted-foreground">
                      Ao concluir a trilha
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrilhaDetalhes;
