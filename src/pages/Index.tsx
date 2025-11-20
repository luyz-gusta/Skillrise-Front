import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { TrilhaCard } from "@/components/TrilhaCard";
import { useStaggerAnimation, useFadeIn } from "@/hooks/useGsapAnimations";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { statsService, PlatformStats } from "@/services/statsService";
import { Trilha } from "@/services/trilhaService";
import {
  Brain,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  Database,
  Users,
  Leaf,
  Shield,
  Briefcase,
} from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import aiImage from "@/assets/ai-automation-bg.jpg";
import dataImage from "@/assets/data-skills-bg.jpg";

// Mapeamento de ícones por categoria
const iconMap: Record<string, any> = {
  "IA & Automação": Brain,
  "Ciência de Dados": Database,
  "Soft Skills": Users,
  "Green Skills": Leaf,
  "Cybersegurança": Shield,
  "Carreiras Digitais": Briefcase,
};

const imageMap: Record<string, string> = {
  "IA & Automação": aiImage,
  "Ciência de Dados": dataImage,
};

const Index = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useFadeIn();
  const featuresRef = useStaggerAnimation();
  const trilhasRef = useStaggerAnimation();

  // Buscar estatísticas da plataforma
  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ['platformStats'],
    queryFn: statsService.getPlatformStats,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Buscar trilhas em destaque
  const { data: trilhasDestaqueData = [], isLoading: isLoadingTrilhas } = useQuery<Trilha[]>({
    queryKey: ['trilhasDestaque'],
    queryFn: () => statsService.getTrilhasDestaque(8),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Pegar apenas as 4 primeiras para exibir
  const trilhasDestaque = trilhasDestaqueData.slice(0, 4);

  const features = [
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Recomendações inteligentes baseadas no seu perfil e objetivos profissionais",
    },
    {
      icon: Target,
      title: "Trilhas Direcionadas",
      description: "Caminhos estruturados para desenvolver competências do futuro",
    },
    {
      icon: TrendingUp,
      title: "Progresso Visível",
      description: "Acompanhe sua evolução com dashboards e métricas claras",
    },
    {
      icon: Award,
      title: "Certificações",
      description: "Valide suas conquistas com certificados reconhecidos pelo mercado",
    },
  ];

  const platformStats = [
    { value: `${stats?.totalTrilhas || 50}+`, label: "Trilhas Disponíveis" },
    { value: `${stats?.totalUsuarios ? Math.floor(stats.totalUsuarios / 1000) : 10}k+`, label: "Profissionais Ativos" },
    { value: `${stats?.taxaConclusao || 95}%`, label: "Taxa de Conclusão" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div ref={heroRef} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight uppercase">
                  Prepare-se para o futuro
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Desenvolva as competências que o mercado vai exigir em 2030. 
                  Trilhas personalizadas, progresso gamificado e certificações reconhecidas.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg">
                    Começar Jornada
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/trilhas">
                  <Button size="lg" variant="outline">
                    Explorar Trilhas
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                {platformStats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden border border-border">
                <img
                  src={heroImage}
                  alt="Aprendizado do futuro"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight">
              Por que escolher a SkillRise?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Plataforma completa para desenvolver as competências mais valorizadas do mercado
            </p>
          </div>

          <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 border-border hover:border-primary/50 transition-colors">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trilhas em Destaque */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight">
              Trilhas em Destaque
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comece sua jornada com as trilhas mais populares da plataforma
            </p>
          </div>

          {isLoadingTrilhas ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-[400px] animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div ref={trilhasRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          )}

          <div className="text-center mt-12">
            <Link to="/trilhas">
              <Button size="lg" variant="outline">
                Ver Todas as Trilhas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Adaptada para logados e não logados */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="p-12 border-border text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                {isAuthenticated ? "Continue sua jornada" : "Comece sua jornada hoje"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {isAuthenticated 
                  ? "Explore novas trilhas e desenvolva competências que vão impulsionar sua carreira"
                  : "Junte-se a milhares de profissionais que estão se preparando para o futuro do trabalho"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button size="lg">
                        Ir para Dashboard
                      </Button>
                    </Link>
                    <Link to="/trilhas">
                      <Button size="lg" variant="outline">
                        Explorar Novas Trilhas
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg">
                        Criar Conta Gratuita
                      </Button>
                    </Link>
                    <Link to="/trilhas">
                      <Button size="lg" variant="outline">
                        Ver Todas as Trilhas
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 SkillRise 2030+. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
