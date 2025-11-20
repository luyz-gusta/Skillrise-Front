import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFadeIn } from "@/hooks/useGsapAnimations";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moduloService } from "@/services/moduloService";
import { inscricaoService } from "@/services/inscricaoService";
import { progressoService } from "@/services/progressoService";
import { trilhaService } from "@/services/trilhaService";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAchievementNotifications } from "@/hooks/useNotifications";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  AlertCircle,
  Loader2,
  Award,
  ChevronRight,
} from "lucide-react";

interface Aula {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

const Modulo = () => {
  const { trilhaId, moduloId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAula, setSelectedAula] = useState<number>(1);
  const contentRef = useFadeIn();
  const sidebarRef = useFadeIn();
  
  const { checkForNewAchievements } = useAchievementNotifications();

  // Buscar dados do módulo
  const { data: modulo, isLoading: isLoadingModulo } = useQuery({
    queryKey: ['modulo', moduloId],
    queryFn: () => moduloService.findById(Number(moduloId)),
    enabled: !!moduloId,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar dados da trilha
  const { data: trilha } = useQuery({
    queryKey: ['trilha', trilhaId],
    queryFn: () => trilhaService.findById(Number(trilhaId)),
    enabled: !!trilhaId,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar todos os módulos da trilha
  const { data: todosModulos } = useQuery({
    queryKey: ['modulos', trilhaId],
    queryFn: () => moduloService.findByTrilhaId(Number(trilhaId)),
    enabled: !!trilhaId,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar inscrição do usuário
  const { data: inscricoes } = useQuery({
    queryKey: ['inscricoes', user?.id],
    queryFn: () => inscricaoService.findByUserId(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Verificar se está inscrito
  const inscricao = useMemo(() => {
    if (!inscricoes || !trilhaId) return null;
    return inscricoes.find(i => i.trilhaId === Number(trilhaId));
  }, [inscricoes, trilhaId]);

  // Buscar progresso
  const { data: progressoData } = useQuery({
    queryKey: ['progresso', inscricao?.inscricaoId],
    queryFn: () => progressoService.findByInscricaoId(inscricao!.inscricaoId),
    enabled: !!inscricao?.inscricaoId,
    staleTime: 1 * 60 * 1000,
  });

  // Verificar se módulo está completo
  const moduloCompleto = useMemo(() => {
    if (!progressoData || !moduloId) return false;
    const prog = progressoData.find(p => p.moduloId === Number(moduloId));
    return prog?.percentage === 100;
  }, [progressoData, moduloId]);

  // Mutation para atualizar progresso
  const updateProgressMutation = useMutation({
    mutationFn: async ({ inscricaoId, moduloId }: { inscricaoId: number; moduloId: number }) => {
      try {
        return await progressoService.updateProgress(inscricaoId, moduloId, 100);
      } catch (error: any) {
        // Se o progresso já existe com 100%, considerar sucesso
        if (error.response?.status === 500 && error.response?.data?.message?.includes('progresso')) {
          console.warn('Progresso já existe, considerando como sucesso');
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
      
      try {
        await checkForNewAchievements();
      } catch (error) {
        console.error('Erro ao verificar conquistas:', error);
      }
      
      queryClient.invalidateQueries({ queryKey: ['progresso', inscricao?.inscricaoId] });
      queryClient.invalidateQueries({ queryKey: ['inscricoes', user?.id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Não foi possível marcar como concluído.";
      toast({
        title: "Erro ao atualizar progresso",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Erro ao atualizar progresso:', error);
    },
  });

  // Handler para completar módulo
  const handleCompleteModulo = () => {
    if (!inscricao || !moduloId) return;
    
    updateProgressMutation.mutate({
      inscricaoId: inscricao.inscricaoId,
      moduloId: Number(moduloId),
    });
  };

  // Próximo e anterior módulo
  const { proximoModulo, moduloAnterior } = useMemo(() => {
    if (!todosModulos || !moduloId) return { proximoModulo: null, moduloAnterior: null };
    
    const currentIndex = todosModulos.findIndex(m => m.moduloId === Number(moduloId));
    
    return {
      proximoModulo: currentIndex < todosModulos.length - 1 ? todosModulos[currentIndex + 1] : null,
      moduloAnterior: currentIndex > 0 ? todosModulos[currentIndex - 1] : null,
    };
  }, [todosModulos, moduloId]);

  // Mock de aulas (pode criar endpoint específico depois)
  const aulas: Aula[] = [
    { id: 1, title: "Introdução ao tema", duration: "8 min", completed: true },
    { id: 2, title: "Conceitos fundamentais", duration: "15 min", completed: true },
    { id: 3, title: "Prática guiada", duration: "20 min", completed: selectedAula > 3 },
    { id: 4, title: "Exercícios práticos", duration: "25 min", completed: false },
    { id: 5, title: "Projeto final", duration: "30 min", completed: false },
    { id: 6, title: "Revisão e quiz", duration: "12 min", completed: false },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="p-8 border-border">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-warning mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Login necessário</h3>
                  <p className="text-muted-foreground mb-4">
                    Faça login para acessar os módulos da trilha
                  </p>
                  <Button onClick={() => navigate('/auth')}>
                    Fazer Login
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!inscricao) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="p-8 border-border">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-warning mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Inscrição necessária</h3>
                  <p className="text-muted-foreground mb-4">
                    Você precisa estar inscrito na trilha para acessar este módulo
                  </p>
                  <Button onClick={() => navigate(`/trilhas/${trilhaId}`)}>
                    Ver Trilha
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingModulo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Carregando módulo...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="p-8 border-destructive/50">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Módulo não encontrado</h3>
                  <p className="text-sm">Este módulo não existe ou foi removido.</p>
                </div>
              </div>
              <Button onClick={() => navigate(`/trilhas/${trilhaId}`)} className="mt-4">
                Voltar para Trilha
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/trilhas')}
            >
              Trilhas
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/trilhas/${trilhaId}`)}
            >
              {trilha?.title || 'Trilha'}
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{modulo.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video/Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card ref={contentRef} className="border-border overflow-hidden">
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <PlayCircle className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{aulas[selectedAula - 1]?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Duração: {aulas[selectedAula - 1]?.duration}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Module Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{modulo.title}</h1>
                      <p className="text-muted-foreground mt-1">{modulo.description}</p>
                    </div>
                    {moduloCompleto && (
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{modulo.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{aulas.length} aulas</span>
                    </div>
                  </div>

                  {!moduloCompleto && (
                    <Button
                      className="w-full"
                      onClick={handleCompleteModulo}
                      disabled={updateProgressMutation.isPending}
                    >
                      {updateProgressMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Marcando como concluído...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Marcar como Concluído
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => moduloAnterior && navigate(`/trilhas/${trilhaId}/modulos/${moduloAnterior.moduloId}`)}
                  disabled={!moduloAnterior}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  onClick={() => proximoModulo && navigate(`/trilhas/${trilhaId}/modulos/${proximoModulo.moduloId}`)}
                  disabled={!proximoModulo}
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Conteúdo do Módulo */}
              <Card className="p-6 border-border">
                <h2 className="text-xl font-bold mb-4">Sobre este módulo</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    {modulo.description}
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Este módulo aborda conceitos fundamentais e práticas essenciais 
                    para o domínio da competência. Através de exemplos práticos e 
                    exercícios, você desenvolverá habilidades aplicáveis ao mundo real.
                  </p>
                </div>
              </Card>
            </div>

            {/* Sidebar - Lista de Aulas */}
            <div ref={sidebarRef} className="space-y-6">
              <Card className="p-6 border-border">
                <h3 className="text-lg font-bold mb-4">Aulas do Módulo</h3>
                <div className="space-y-2">
                  {aulas.map((aula) => (
                    <button
                      key={aula.id}
                      onClick={() => setSelectedAula(aula.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedAula === aula.id
                          ? "bg-primary/10 border border-primary/50"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          aula.completed ? "bg-success/10" : "bg-muted"
                        }`}>
                          {aula.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <span className="text-sm font-semibold">{aula.id}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{aula.title}</p>
                          <p className="text-xs text-muted-foreground">{aula.duration}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Progresso */}
              <Card className="p-6 border-border">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso do módulo</span>
                    <span className="font-semibold">
                      {Math.round((aulas.filter(a => a.completed).length / aulas.length) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(aulas.filter(a => a.completed).length / aulas.length) * 100} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground">
                    {aulas.filter(a => a.completed).length} de {aulas.length} aulas concluídas
                  </p>
                </div>
              </Card>

              {/* Certificado */}
              {moduloCompleto && (
                <Card className="p-6 border-border">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto">
                      <Award className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Módulo Concluído!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Continue para o próximo módulo
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modulo;
