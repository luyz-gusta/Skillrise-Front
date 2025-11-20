import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-12 border-border text-center">
        <div className="space-y-8">
          {/* 404 Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <Compass className="h-16 w-16 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <span className="text-warning font-bold text-lg">?</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h1 className="text-6xl font-bold uppercase tracking-tight">404</h1>
            <h2 className="text-2xl font-bold text-foreground">Página não encontrada</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ops! Parece que você se perdeu em sua jornada de aprendizado. 
              A página que você procura não existe ou foi movida.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/">
              <Button size="lg">
                <Home className="mr-2 h-5 w-5" />
                Voltar ao Início
              </Button>
            </Link>
            <Link to="/trilhas">
              <Button size="lg" variant="outline">
                <Search className="mr-2 h-5 w-5" />
                Explorar Trilhas
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Precisa de ajuda? Aqui estão alguns links úteis:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link to="/dashboard" className="text-primary hover:underline">
                Dashboard
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/perfil" className="text-primary hover:underline">
                Perfil
              </Link>
              <span className="text-muted-foreground">•</span>
              <button 
                onClick={() => window.history.back()} 
                className="text-primary hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Voltar
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
