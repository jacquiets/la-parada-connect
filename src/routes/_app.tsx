import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Bell, Search, LogOut } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUser, isAuthenticated, logout } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const user = getUser();
  
  const handleLogout = () => {
    logout();
    navigate({ to: "/auth" });
  };

  // Extraer iniciales (ej. Juan Pérez -> JP)
  const initials = user
    ? `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase()
    : "U";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar órdenes, camiones, comerciantes..."
              className="pl-9 bg-muted/40 border-transparent focus-visible:bg-background"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-primary">
                3
              </Badge>
            </Button>
            <div className="flex items-center gap-2 pl-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[var(--brand-dark)] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block leading-tight">
                <p className="text-sm font-medium text-foreground">
                  {user ? `${user.nombres} ${user.apellidos}` : "Usuario"}
                </p>
                <p className="text-[11px] text-muted-foreground capitalize">
                  {user?.rol_nombre || "Invitado"}
                </p>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-6 ml-2" />
            
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar Sesión">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
