import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { TrilhaCard } from "@/components/TrilhaCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrilhaCardSkeleton } from "@/components/LoadingSkeletons";
import { useStaggerAnimation, useFadeIn } from "@/hooks/useGsapAnimations";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { trilhaService } from "@/services/trilhaService";
import { useNotificationRefresh } from "@/hooks/useNotifications";
import {
  Brain,
  Database,
  Users,
  Leaf,
  Shield,
  Briefcase,
  Search,
  AlertCircle,
} from "lucide-react";
import aiImage from "@/assets/ai-automation-bg.jpg";
import dataImage from "@/assets/data-skills-bg.jpg";

// Mapeamento de ícones por nome de trilha
const iconMap: Record<string, any> = {
  "IA & Automação": Brain,
  "Ciência de Dados": Database,
  "Soft Skills": Users,
  "Green Skills": Leaf,
  "Cybersegurança": Shield,
  "Carreiras Digitais": Briefcase,
};

// Mapeamento de imagens (placeholder - você pode adicionar mais)
const imageMap: Record<string, string> = {
  "IA & Automação": aiImage,
  "Ciência de Dados": dataImage,
};

const Trilhas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("Todos");
  
  // Atualizar notificações automaticamente
  useNotificationRefresh(30000);

  // Buscar trilhas da API usando TanStack Query
  const { data: trilhasData, isLoading, isError, error } = useQuery({
    queryKey: ['trilhas'],
    queryFn: trilhaService.findAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mapear dados da API para formato do componente
  const trilhas = useMemo(() => {
    if (!trilhasData) return [];
    
    return trilhasData.map((trilha) => ({
      id: trilha.trilhaId,
      title: trilha.title,
      description: trilha.description,
      icon: iconMap[trilha.title] || Brain,
      duration: `${Math.ceil(trilha.durationHours / 4)} semanas`,
      level: trilha.difficulty === "INICIANTE" ? "Iniciante" : 
             trilha.difficulty === "INTERMEDIARIO" ? "Intermediário" : "Avançado",
      modules: 12, // Placeholder - pode ser obtido de outro endpoint
      image: trilha.imageUrl || imageMap[trilha.title] || null,
    }));
  }, [trilhasData]);

  const mockTrilhas = [
    {
      id: 1,
      title: "IA & Automação",
      description: "Domine machine learning, deep learning e automação de processos para liderar a transformação digital.",
      icon: Brain,
      duration: "8 semanas",
      level: "Intermediário",
      modules: 12,
      image: aiImage,
    },
    {
      id: 2,
      title: "Ciência de Dados",
      description: "Aprenda análise de dados, visualização, estatística e ferramentas essenciais como Python e SQL.",
      icon: Database,
      duration: "10 semanas",
      level: "Iniciante",
      modules: 15,
      image: dataImage,
    },
    {
      id: 3,
      title: "Soft Skills & Liderança",
      description: "Desenvolva comunicação, colaboração, pensamento crítico e habilidades de liderança do futuro.",
      icon: Users,
      duration: "6 semanas",
      level: "Iniciante",
      modules: 10,
      image: null,
    },
    {
      id: 4,
      title: "Green Skills",
      description: "Competências para economia sustentável, ESG, energias renováveis e desenvolvimento regenerativo.",
      icon: Leaf,
      duration: "7 semanas",
      level: "Intermediário",
      modules: 11,
      image: null,
    },
    {
      id: 5,
      title: "Cybersegurança",
      description: "Proteção de dados, segurança de redes, ethical hacking e gestão de riscos digitais.",
      icon: Shield,
      duration: "9 semanas",
      level: "Avançado",
      modules: 14,
      image: null,
    },
    {
      id: 6,
      title: "Carreiras Digitais",
      description: "Marketing digital, gestão de produtos, UX/UI design e empreendedorismo na era digital.",
      icon: Briefcase,
      duration: "8 semanas",
      level: "Iniciante",
      modules: 13,
      image: null,
    },
  ];

  // Usar trilhas da API ou fallback para mock
  const displayTrilhas = trilhas.length > 0 ? trilhas : mockTrilhas;

  // Filtros e busca
  const filteredTrilhas = useMemo(() => {
    return displayTrilhas.filter((trilha) => {
      const matchesSearch = trilha.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trilha.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === "Todos" || trilha.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchTerm, selectedLevel, displayTrilhas]);

  const levels = ["Todos", "Iniciante", "Intermediário", "Avançado"];

  // Animation refs
  const headerRef = useFadeIn();
  const gridRef = useStaggerAnimation([filteredTrilhas]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div ref={headerRef} className="mb-8">
            <h1 className="text-4xl font-bold mb-4 uppercase tracking-tight">
              Trilhas de Aprendizagem
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Escolha sua jornada de aprendizado. Cada trilha foi desenhada para desenvolver
              competências essenciais para o futuro do trabalho.
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="mb-8 space-y-4">
            {/* Busca */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar trilhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por nível */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center mr-2">Nível:</span>
              {levels.map((level) => (
                <Badge
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </Badge>
              ))}
            </div>

            {/* Contador de resultados */}
            <p className="text-sm text-muted-foreground">
              {filteredTrilhas.length} {filteredTrilhas.length === 1 ? "trilha encontrada" : "trilhas encontradas"}
            </p>
          </div>

          {/* Trilhas Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TrilhaCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <Card className="p-12 text-center border-border mb-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Erro ao carregar trilhas</h3>
                  <p className="text-sm text-muted-foreground">
                    {error instanceof Error ? error.message : "Não foi possível carregar as trilhas. Tente novamente mais tarde."}
                  </p>
                </div>
              </div>
            </Card>
          ) : filteredTrilhas.length > 0 ? (
            <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredTrilhas.map((trilha) => (
                <TrilhaCard key={trilha.id} {...trilha} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-border mb-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Nenhuma trilha encontrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros ou buscar por outros termos.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedLevel("Todos");
                  }}
                >
                  Limpar filtros
                </Badge>
              </div>
            </Card>
          )}

          {/* Stats Footer */}
          <Card className="p-8 border-border">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Trilhas disponíveis</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Horas de conteúdo</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">10k+</div>
                <div className="text-sm text-muted-foreground">Alunos ativos</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trilhas;
