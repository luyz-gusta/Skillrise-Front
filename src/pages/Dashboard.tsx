import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";
import { TrilhaCard } from "@/components/TrilhaCard";
import { useStaggerAnimation } from "@/hooks/useGsapAnimations";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { inscricaoService } from "@/services/inscricaoService";
import { progressoService } from "@/services/progressoService";
import { trilhaService } from "@/services/trilhaService";
import { moduloService } from "@/services/moduloService";
import { userService } from "@/services/userService";
import { metaService } from "@/services/metaService";
import { statsService } from "@/services/statsService";
import { achievementService } from "@/services/achievementService";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationRefresh } from "@/hooks/useNotifications";
import {
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Brain,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Target,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"recent" | "priority">("recent");
  
  // Atualizar notificações automaticamente a cada 30 segundos
  useNotificationRefresh(30000);

  // Buscar dados detalhados do usuário
  const { data: userData } = useQuery({
    queryKey: ['user', user?.userId],
    queryFn: () => userService.findById(user!.userId),
    enabled: !!user?.userId,
    staleTime: 5 * 60 * 1000,
  });
  
  // Buscar inscrições do usuário
  const { data: inscricoes, isLoading: isLoadingInscricoes } = useQuery({
    queryKey: ['inscricoes', user?.id],
    queryFn: () => inscricaoService.findByUserId(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Buscar progresso de todas as inscrições
  const { data: allProgresso, isLoading: isLoadingProgresso } = useQuery({
    queryKey: ['allProgresso', inscricoes],
    queryFn: async () => {
      if (!inscricoes) return [];
      const progressos = await Promise.all(
        inscricoes.map(i => progressoService.findByInscricaoId(i.inscricaoId))
      );
      return progressos.flat();
    },
    enabled: !!inscricoes && inscricoes.length > 0,
    staleTime: 1 * 60 * 1000,
  });

  // Buscar detalhes das trilhas inscritas
  const { data: trilhas } = useQuery({
    queryKey: ['trilhasInscritas', inscricoes],
    queryFn: async () => {
      if (!inscricoes) return [];
      const trilhasData = await Promise.all(
        inscricoes.map(i => trilhaService.findById(i.trilhaId))
      );
      return trilhasData;
    },
    enabled: !!inscricoes && inscricoes.length > 0,
  });

  // Buscar trilhas em destaque (para usuários sem inscrições)
  const { data: trilhasDestaque = [] } = useQuery({
    queryKey: ['trilhasDestaque'],
    queryFn: () => statsService.getTrilhasDestaque(3),
    enabled: !inscricoes || inscricoes.length === 0,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar metas do usuário
  const { data: metas = [] } = useQuery({
    queryKey: ['metas', user?.userId],
    queryFn: async () => {
      try {
        const result = await metaService.findByUserId(user!.userId);
        return result || [];
      } catch (error) {
        console.error('Erro ao buscar metas:', error);
        return [];
      }
    },
    enabled: !!user?.userId,
    staleTime: 2 * 60 * 1000,
  });

  // Buscar conquistas do usuário
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.userId],
    queryFn: async () => {
      try {
        const result = await achievementService.findByUserId(user!.userId);
        return result || [];
      } catch (error) {
        console.error('Erro ao buscar achievements:', error);
        return [];
      }
    },
    enabled: !!user?.userId,
    staleTime: 2 * 60 * 1000,
  });

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!inscricoes || !allProgresso) {
      return {
        level: 1,
        badges: 0,
        streak: 0,
        totalModulosCompletos: 0,
        horasEstudadas: 0,
      };
    }

    const totalModulosCompletos = allProgresso.filter(p => p.percentage === 100).length;
    const level = userData?.level || user?.level || 1;
    const badges = achievements?.length || 0;
    const streak = userData?.streakDias || 0; // Streak vem do backend
    const horasEstudadas = totalModulosCompletos * 2; // Estimativa baseada em módulos

    return { level, badges, streak, totalModulosCompletos, horasEstudadas };
  }, [inscricoes, allProgresso, userData, user, achievements]);

  // Trilha atual (mais recente com progresso < 100%)
  const trilhaAtual = useMemo(() => {
    if (!inscricoes || !trilhas || !allProgresso) return null;
    
    // Ordenar por data de inscrição (mais recente primeiro)
    const inscricoesOrdenadas = [...inscricoes].sort(
      (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    );

    for (const inscricao of inscricoesOrdenadas) {
      const trilha = trilhas.find(t => t.trilhaId === inscricao.trilhaId);
      const progresso = allProgresso.filter(p => p.inscricaoId === inscricao.inscricaoId);
      
      if (trilha && progresso.length > 0) {
        const modulosCompletos = progresso.filter(p => p.percentage === 100).length;
        const totalModulos = progresso.length;
        const percentualGeral = Math.round((modulosCompletos / totalModulos) * 100);
        
        if (percentualGeral < 100) {
          return {
            inscricao,
            trilha,
            progresso,
            modulosCompletos,
            totalModulos,
            percentualGeral,
          };
        }
      }
    }
    
    return null;
  }, [inscricoes, trilhas, allProgresso]);

  const statsRef = useStaggerAnimation([isLoadingInscricoes]);
  const activitiesRef = useStaggerAnimation([isLoadingInscricoes]);

  // Redirecionar se não estiver logado
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="p-8 border-destructive/50">
              <div className="flex items-center gap-3 text-destructive mb-4">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Acesso Restrito</h3>
                  <p className="text-sm">Você precisa estar logado para acessar o dashboard.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/auth')}>
                Fazer Login
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingInscricoes || isLoadingProgresso) {
    return (
      <>
        <Navbar />
        <DashboardSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold uppercase tracking-tight">
                Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ordenar por:</span>
                <Button
                  variant={sortBy === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("recent")}
                >
                  Recentes
                </Button>
                <Button
                  variant={sortBy === "priority" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("priority")}
                >
                  Prioridade
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Continue sua jornada rumo às competências de 2030+
            </p>
          </div>

          {/* Stats Grid */}
          <div ref={statsRef} className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Level {stats.level}</div>
                  <div className="text-sm text-muted-foreground">Seu nível atual</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.badges} Badges</div>
                  <div className="text-sm text-muted-foreground">Conquistas desbloqueadas</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.streak} dias</div>
                  <div className="text-sm text-muted-foreground">Sequência de estudo</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Progress */}
            <div className="lg:col-span-2 space-y-8">
              {trilhaAtual ? (
                <Card className="p-8 border-border">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 uppercase">{trilhaAtual.trilha.title}</h2>
                      <p className="text-sm text-muted-foreground">Sua trilha atual</p>
                    </div>
                    <Badge variant="secondary">Em progresso</Badge>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-muted-foreground">Progresso geral</span>
                        <span className="font-semibold">{trilhaAtual.percentualGeral}%</span>
                      </div>
                      <Progress value={trilhaAtual.percentualGeral} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
                      <div>
                        <div className="text-2xl font-bold">{trilhaAtual.modulosCompletos}/{trilhaAtual.totalModulos}</div>
                        <div className="text-sm text-muted-foreground">Módulos concluídos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.horasEstudadas}h</div>
                        <div className="text-sm text-muted-foreground">Horas estudadas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{trilhaAtual.percentualGeral}%</div>
                        <div className="text-sm text-muted-foreground">Desempenho</div>
                      </div>
                    </div>

                    <Link to={`/trilhas/${trilhaAtual.trilha.trilhaId}`} className="block pt-2">
                      <Button className="w-full">
                        Continuar Aprendendo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="space-y-8">
                  <Card className="p-8 border-border">
                    <div className="text-center space-y-4">
                      <Brain className="h-16 w-16 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Nenhuma trilha em progresso</h3>
                      <p className="text-muted-foreground mb-4">
                        Comece sua jornada inscrevendo-se em uma trilha
                      </p>
                      <Link to="/trilhas">
                        <Button>
                          Explorar Trilhas
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    </div>
                  </Card>

                  {/* Trilhas Recomendadas */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 uppercase">Trilhas Recomendadas</h3>
                    {trilhasDestaque.length > 0 ? (
                      <div className="grid md:grid-cols-3 gap-6">
                        {trilhasDestaque.map((trilha) => (
                          <TrilhaCard
                            key={trilha.trilhaId}
                            id={trilha.trilhaId}
                            title={trilha.title}
                            description={trilha.description}
                            icon={Brain}
                            duration={`${Math.ceil(trilha.durationHours / 4)} semanas`}
                            level={trilha.difficulty}
                            modules={8}
                            image={trilha.imageUrl}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 border-border border-dashed">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 rounded-lg bg-muted mx-auto flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-2">Explore nossa biblioteca</h4>
                            <p className="text-muted-foreground text-sm mb-4">
                              Descubra trilhas personalizadas para desenvolver as competências do futuro
                            </p>
                            <Link to="/trilhas">
                              <Button variant="outline">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Ver Todas as Trilhas
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Conquistas Recentes */}
              <div>
                <h3 className="text-xl font-bold mb-4 uppercase">Conquistas Recentes</h3>
                {achievements.length > 0 ? (
                  <div ref={activitiesRef} className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <Card key={achievement.achievementId} className="p-4 border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{achievement.nome}</p>
                            <p className="text-xs text-muted-foreground">{achievement.descricao}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 border-border border-dashed">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-muted mx-auto flex items-center justify-center">
                        <Award className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Nenhuma conquista ainda</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Complete trilhas e desafios para desbloquear badges
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Metas do Usuário */}
              <div>
                <h3 className="text-xl font-bold mb-4 uppercase">Metas</h3>
                {metas.length > 0 ? (
                  <div className="space-y-3">
                    {metas.map((meta) => {
                      const atingida = meta.progresso >= 100;
                      
                      return (
                        <Card key={meta.metaId} className="p-4 border-border">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  atingida ? 'bg-success/10' : 'bg-primary/10'
                                }`}>
                                  <Target className={`h-5 w-5 ${atingida ? 'text-success' : 'text-primary'}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{meta.titulo}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {meta.tipo}{meta.prazo && ` • Prazo: ${new Date(meta.prazo).toLocaleDateString('pt-BR')}`}
                                  </p>
                                </div>
                              </div>
                              {atingida && (
                                <Badge className="bg-success/10 text-success border-success/20">
                                  Concluída
                                </Badge>
                              )}
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-2">
                                <span className="text-muted-foreground">Progresso</span>
                                <span className="font-semibold">{meta.currentValue}/{meta.targetValue}</span>
                              </div>
                              <Progress value={meta.progresso} className="h-2" />
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="p-6 border-border border-dashed">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-muted mx-auto flex items-center justify-center">
                        <Target className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Nenhuma meta definida</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Defina metas para acompanhar seu progresso
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2">
                        <Target className="mr-2 h-4 w-4" />
                        Criar Meta
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
