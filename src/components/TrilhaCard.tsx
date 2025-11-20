import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen, ArrowRight, LucideIcon } from "lucide-react";

interface TrilhaCardProps {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  level: string;
  modules: number;
  image?: string | null;
}

export const TrilhaCard = ({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  duration, 
  level, 
  modules, 
  image 
}: TrilhaCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Iniciante":
        return "bg-success/10 text-success border-success/20";
      case "Intermediário":
        return "bg-warning/10 text-warning border-warning/20";
      case "Avançado":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors group">
      {/* Image or Icon Header */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Icon className="h-16 w-16 text-primary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={getLevelColor(level)}>
              {level}
            </Badge>
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{modules} módulos</span>
          </div>
        </div>

        <Link to={`/trilhas/${id}`} className="block pt-2">
          <Button className="w-full" variant="outline">
            Ver Trilha
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
