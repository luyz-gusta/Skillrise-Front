import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCard } from "@/components/BadgeCard";
import { PerfilSkeleton } from "@/components/LoadingSkeletons";
import { useStaggerAnimation, useFadeIn } from "@/hooks/useGsapAnimations";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { inscricaoService } from "@/services/inscricaoService";
import { progressoService } from "@/services/progressoService";
import { trilhaService } from "@/services/trilhaService";
import { userService } from "@/services/userService";
import * as achievementService from "@/services/achievementService";
import * as certificadoService from "@/services/certificadoService";
import { useNavigate } from "react-router-dom";
import { useNotificationRefresh } from "@/hooks/useNotifications";
import {
  Award,
  TrendingUp,
  Target,
  Flame,
  Settings,
  Trophy,
  AlertCircle,
} from "lucide-react";

const Perfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Atualizar notificações automaticamente
  useNotificationRefresh(30000);

  // Buscar dados detalhados do usuário
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => userService.findById(user!.id),
    enabled: !!user?.id,
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

  // Buscar detalhes das trilhas
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

  // Buscar conquistas do usuário
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.userId],
    queryFn: () => achievementService.findByUserId(user!.userId),
    enabled: !!user?.userId,
    staleTime: 2 * 60 * 1000,
  });

  // Buscar certificados do usuário
  const { data: certificados = [] } = useQuery({
    queryKey: ['certificados', user?.userId],
    queryFn: () => certificadoService.findByUserId(user!.userId),
    enabled: !!user?.userId,
    staleTime: 2 * 60 * 1000,
  });

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!inscricoes || !allProgresso) {
      return {
        totalModulosCompletos: 0,
        horasEstudadas: 0,
        taxaConclusao: 0,
        level: 1,
        badges: 0,
        streak: 0,
      };
    }

    const totalModulosCompletos = allProgresso.filter(p => p.percentage === 100).length;
    const horasEstudadas = totalModulosCompletos * 2; // Estimativa
    const totalModulos = allProgresso.length;
    const taxaConclusao = totalModulos > 0 ? Math.round((totalModulosCompletos / totalModulos) * 100) : 0;
    const level = Math.floor(totalModulosCompletos / 5) + 1;
    const badges = Math.floor(totalModulosCompletos / 3);
    const streak = inscricoes.length > 0 ? Math.floor(Math.random() * 30) + 1 : 0;

    return { totalModulosCompletos, horasEstudadas, taxaConclusao, level, badges, streak };
  }, [inscricoes, allProgresso]);

  // Histórico de trilhas
  const trilhasHistorico = useMemo(() => {
    if (!inscricoes || !trilhas || !allProgresso) return [];

    return inscricoes.map(inscricao => {
      const trilha = trilhas.find(t => t.trilhaId === inscricao.trilhaId);
      const progresso = allProgresso.filter(p => p.inscricaoId === inscricao.inscricaoId);
      
      if (!trilha) return null;

      const modulosCompletos = progresso.filter(p => p.percentage === 100).length;
      const totalModulos = progresso.length;
      const percentual = totalModulos > 0 ? Math.round((modulosCompletos / totalModulos) * 100) : 0;
      const status = percentual === 100 ? "Concluída" : "Em andamento";

      return {
        title: trilha.title,
        progress: percentual,
        status,
      };
    }).filter(Boolean);
  }, [inscricoes, trilhas, allProgresso]);

  const badgesRef = useStaggerAnimation([isLoadingInscricoes]);
  const headerRef = useFadeIn([isLoadingUser]);

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
                  <p className="text-sm">Você precisa estar logado para acessar o perfil.</p>
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

  if (isLoadingUser || isLoadingInscricoes || isLoadingProgresso) {
    return (
      <>
        <Navbar />
        <PerfilSkeleton />
      </>
    );
  }

  const badges = [
    {
      icon: Award,
      title: "Mestre em ML",
      description: "Completou 5 módulos de Machine Learning",
      unlocked: stats.totalModulosCompletos >= 5,
    },
    {
      icon: Flame,
      title: `Sequência de ${stats.streak} dias`,
      description: `Manteve prática diária por ${stats.streak} dias`,
      unlocked: stats.streak >= 7,
    },
    {
      icon: TrendingUp,
      title: "Aprendiz Dedicado",
      description: "Completou múltiplos módulos",
      unlocked: stats.totalModulosCompletos >= 3,
    },
    {
      icon: Trophy,
      title: "Nível " + stats.level,
      description: `Alcançou o nível ${stats.level}`,
      unlocked: stats.level >= 2,
    },
    {
      icon: Award,
      title: "IA Expert",
      description: "Domine trilha completa de IA",
      unlocked: stats.totalModulosCompletos >= 12,
    },
    {
      icon: Award,
      title: "Mentor",
      description: "Ajude a comunidade",
      unlocked: false,
    },
  ];

  const competencias = [
    { name: "Machine Learning", level: Math.min(stats.totalModulosCompletos * 8, 100) },
    { name: "Python", level: Math.min(stats.totalModulosCompletos * 9, 100) },
    { name: "Deep Learning", level: Math.min(stats.totalModulosCompletos * 7, 100) },
    { name: "Análise de Dados", level: Math.min(stats.totalModulosCompletos * 8, 100) },
    { name: "TensorFlow", level: Math.min(stats.totalModulosCompletos * 6, 100) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Profile Header */}
          <Card ref={headerRef} className="mb-12 p-8 border-border">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex gap-6 items-center">
                <Avatar className="h-24 w-24 border-4 border-border">
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'US'}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold uppercase">{userData?.name || user?.name || 'Usuário'}</h1>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Level {stats.level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {userData?.email || user?.email}
                  </p>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>{inscricoes?.length || 0} trilhas ativas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-success" />
                      <span>{stats.badges} badges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-warning" />
                      <span>{stats.streak} dias de sequência</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </div>
          </Card>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conquistas */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 uppercase">Conquistas Desbloqueadas</h2>
                <div ref={badgesRef} className="grid md:grid-cols-2 gap-4">
                  {achievements.length > 0 ? (
                    achievements.map((achievement) => (
                      <BadgeCard
                        key={achievement.achievementId}
                        icon={Trophy}
                        title={achievement.nome}
                        description={achievement.descricao}
                        unlocked={true}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Complete módulos para desbloquear conquistas!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificados */}
              {certificados.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 uppercase">Certificados</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {certificados.map((certificado) => (
                      <Card key={certificado.certificadoId} className="p-6 border-border hover:border-primary/50 transition-colors">
                        <div className="space-y-4">
                          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                            <Award className="h-6 w-6 text-success" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{certificado.trilhaTitle}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Código: {certificado.codigo}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Emitido em {new Date(certificado.dataEmissao).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge className="bg-success/10 text-success border-success/20">
                            {certificado.status}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Histórico */}
              <div>
                <h2 className="text-2xl font-bold mb-6 uppercase">Histórico de Trilhas</h2>
                <div className="space-y-4">
                  {trilhasHistorico.map((trilha, index) => (
                    <Card key={index} className="p-6 border-border">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{trilha.title}</h3>
                          <Badge variant="secondary">{trilha.status}</Badge>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-semibold">{trilha.progress}%</span>
                          </div>
                          <Progress value={trilha.progress} className="h-2" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Competências */}
            <div>
              <h2 className="text-2xl font-bold mb-6 uppercase">Competências</h2>
              <Card className="p-6 border-border">
                <div className="space-y-6">
                  {competencias.map((comp, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{comp.name}</span>
                        <span className="text-muted-foreground">{comp.level}%</span>
                      </div>
                      <Progress value={comp.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Stats Card */}
              <Card className="p-6 border-border mt-8">
                <h3 className="font-bold mb-6 uppercase">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Horas estudadas</span>
                    <span className="text-2xl font-bold">{stats.horasEstudadas}h</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Módulos concluídos</span>
                    <span className="text-2xl font-bold">{stats.totalModulosCompletos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taxa de conclusão</span>
                    <span className="text-2xl font-bold">{stats.taxaConclusao}%</span>
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

export default Perfil;
