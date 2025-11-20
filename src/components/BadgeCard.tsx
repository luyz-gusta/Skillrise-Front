import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface BadgeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  unlocked: boolean;
}

export const BadgeCard = ({ icon: Icon, title, description, unlocked }: BadgeCardProps) => {
  return (
    <Card
      className={`p-6 border-border ${
        unlocked ? "" : "opacity-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          unlocked ? "bg-primary/10" : "bg-muted"
        }`}>
          <Icon className={`h-6 w-6 ${
            unlocked ? "text-primary" : "text-muted-foreground"
          }`} />
        </div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};
