import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Card className="shadow-sm border-border/70 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-foreground">Próximamente</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Este módulo está en construcción. La interfaz operativa estará disponible en
            la siguiente iteración.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
