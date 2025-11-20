import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlayCircle, Lock, Loader2 } from "lucide-react";

interface ModuloCardProps {
  id: number;
  title: string;
  aulas: number;
  duration: string;
  completed: boolean;
  locked: boolean;
  current?: boolean;
  onComplete?: (moduloId: number) => void;
  isUpdating?: boolean;
  inscricaoId?: number;
}

export const ModuloCard = ({
  id,
  title,
  aulas,
  duration,
  completed,
  locked,
  current = false,
  onComplete,
  isUpdating = false,
  inscricaoId,
}: ModuloCardProps) => {
  return (
    <Card
      className={`p-6 border-border transition-colors ${
        current
          ? "border-primary/50"
          : "hover:border-primary/30"
      } ${locked ? "opacity-60" : "cursor-pointer"}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          completed
            ? "bg-success/10"
            : locked
            ? "bg-muted"
            : "bg-primary/10"
        }`}>
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : locked ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : (
            <PlayCircle className="h-5 w-5 text-primary" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span>{aulas} aulas</span>
                <span>{duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {current && !completed && (
                <Badge variant="secondary" className="text-xs">Atual</Badge>
              )}
              {!completed && !locked && inscricaoId && onComplete && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onComplete(id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Concluir'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
