import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Rocket, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">
                SkillRise
              </span>
              <span className="text-xs text-muted-foreground">2030+</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/trilhas"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive("/trilhas") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Trilhas
            </Link>
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive("/dashboard") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/perfil"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive("/perfil") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Perfil
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user?.userId && <NotificationBell userId={user.userId} />}
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">
                    Começar Agora
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/trilhas"
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trilhas
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/perfil"
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Perfil
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="ghost" size="sm" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button size="sm" className="w-full">
                        Começar Agora
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
