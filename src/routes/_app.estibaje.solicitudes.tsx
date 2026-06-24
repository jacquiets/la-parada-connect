import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { PackagePlus, Plus, Calendar, Clock, History } from "lucide-react";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/estibaje/solicitudes")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Comerciante" && user?.rol_nombre !== "Administrador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({
    meta: [{ title: "Consultar Solicitudes — La Parada" }],
  }),
  component: SolicitudesPage,
});

function SolicitudesPage() {
  const historial = [
    { id: "SOL-2024-001", fecha: "Hoy, 08:30 AM", tipo: "Descarga de papas", estado: "Completado", pago: "S/ 120.00", color: "bg-emerald-100 text-emerald-700" },
    { id: "SOL-2024-002", fecha: "Hoy, 10:15 AM", tipo: "Carga mixta", estado: "Asignando", pago: "S/ 85.00", color: "bg-blue-100 text-blue-700" },
    { id: "SOL-2024-003", fecha: "Ayer, 04:00 PM", tipo: "Descarga de cebollas", estado: "Completado", pago: "S/ 150.00", color: "bg-emerald-100 text-emerald-700" },
    { id: "SOL-2024-004", fecha: "18 Jun, 09:00 AM", tipo: "Carga de frutas", estado: "Cancelado", pago: "S/ 0.00", color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Solicitudes de Estibaje
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta tu historial de servicios solicitados o crea uno nuevo.
          </p>
        </div>
        <div className="flex shrink-0">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Nueva Solicitud
          </Button>
        </div>
      </div>

      {/* Tarjeta principal con historial */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Historial Reciente</CardTitle>
          </div>
          <CardDescription>
            Tus últimas 4 solicitudes registradas en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {historial.map((sol) => (
              <div key={sol.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors gap-4">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex mt-1 h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <PackagePlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{sol.id}</span>
                      <Badge variant="secondary" className={`${sol.color} border-0 text-xs px-2 py-0.5`}>
                        {sol.estado}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{sol.tipo}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {sol.fecha.split(',')[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {sol.fecha.split(',')[1]}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0 mt-1 sm:mt-0">
                  <span className="text-sm text-muted-foreground sm:mb-1">Costo estimado</span>
                  <span className="font-semibold text-foreground">{sol.pago}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
