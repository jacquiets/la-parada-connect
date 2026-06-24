import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  Briefcase,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — La Parada" }],
  }),
  component: DashboardPage,
});

// ─── DASHBOARD ESTIBADOR ──────────────────────────────────────────────────────

function DashboardEstibador({ user }: { user: any }) {
  const metrics = [
    { title: "Ganancias Hoy", value: "S/ 120.00", change: "+S/ 30 vs. ayer", icon: Wallet, trend: "up" },
    { title: "Órdenes Completadas", value: "4", change: "Excelente rendimiento", icon: CheckCircle2, trend: "up" },
    { title: "Trabajos Disponibles", value: "15", change: "En la bolsa de trabajo", icon: Briefcase, trend: "neutral" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bienvenido de vuelta,</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            {user ? `${user.nombres} ${user.apellidos}` : "Estibador"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Aquí tienes el resumen de tu actividad laboral de hoy.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/estibaje/billetera">Retirar Fondos</Link>
          </Button>
          <Button asChild className="shadow-sm">
            <Link to="/estibaje/ordenes">
              Ver Bolsa de Trabajo
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.title} className="shadow-sm border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <m.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{m.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {m.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-600" />}
                {m.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD ADMINISTRADOR ──────────────────────────────────────────────────

function DashboardAdministrador({ user }: { user: any }) {
  const metrics = [
    { title: "Usuarios por Validar", value: "24", change: "Requiere atención", icon: UserCheck, trend: "neutral" },
    { title: "Alertas de Salubridad", value: "3", change: "Camiones observados", icon: AlertTriangle, trend: "down" },
    { title: "Transacciones Hoy", value: "S/ 12,450", change: "+15% vs. ayer", icon: TrendingUp, trend: "up" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bienvenido al Panel de Control,</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            {user ? `${user.nombres} ${user.apellidos}` : "Administrador"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Visión general del sistema de La Parada.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="shadow-sm">
            <Link to="/formalizacion/perfiles">
              Validar Usuarios
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.title} className="shadow-sm border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <m.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{m.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {m.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD COMERCIANTE ────────────────────────────────────────────────────

function DashboardComerciante({ user }: { user: any }) {
  const metrics = [
    { title: "Camiones Programados hoy", value: "12", change: "+2 vs. ayer", icon: Truck, trend: "up" },
    { title: "Pagos Formales Pendientes", value: "3", change: "Requiere tu atención", icon: Wallet, trend: "neutral" },
    { title: "Saldo en Billetera", value: "S/ 4,820.50", change: "+S/ 350 esta semana", icon: Wallet, trend: "up" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bienvenido de vuelta,</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            {user ? `${user.nombres} ${user.apellidos}` : "Usuario"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Aquí tienes un resumen de tu operación logística de hoy.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/logistica/camiones">Programar camión</Link>
          </Button>
          <Button asChild className="shadow-sm">
            <Link to="/estibaje/solicitudes">
              Solicitar estibaje
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.title} className="shadow-sm border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <m.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{m.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {m.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-600" />}
                {m.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm border-border/70 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Próximos Camiones</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Camiones programados para hoy.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/logistica/camiones">Ver todo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {/* Mocked logic for trucks instead of orders */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Placa ABC-123</p>
                  <p className="text-xs text-muted-foreground">Llegada: 10:30 AM</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 font-medium">En camino</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Próximas tareas</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Lo que necesita tu atención.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <TaskItem icon={<Wallet className="h-4 w-4 text-primary" />} title="Pago formal pendiente" meta="S/ 320.00 · Por estibaje" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskItem({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/70 p-3">
      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────

function DashboardPage() {
  const user = getUser();
  const role = user?.rol_nombre;

  if (role === "Estibador") return <DashboardEstibador user={user} />;
  if (role === "Administrador") return <DashboardAdministrador user={user} />;
  
  return <DashboardComerciante user={user} />;
}
