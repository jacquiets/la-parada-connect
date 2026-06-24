import { Link, useRouterState } from "@tanstack/react-router";
import {
  Truck,
  UserCheck,
  ClipboardList,
  PackagePlus,
  Briefcase,
  CreditCard,
  Wallet,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "General",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Módulo de Formalización",
    items: [{ title: "Validar Perfiles", url: "/formalizacion/perfiles", icon: UserCheck }],
  },
  {
    label: "Módulo de Logística",
    items: [
      { title: "Programar Ingreso de Camión", url: "/logistica/camiones", icon: Truck },
      { title: "Inspecciones de Salubridad", url: "/logistica/inspecciones", icon: ClipboardList },
    ],
  },
  {
    label: "Módulo de Estibaje Seguro",
    items: [
      { title: "Solicitar Servicio de Estibaje", url: "/estibaje/solicitar", icon: PackagePlus },
      { title: "Órdenes de Trabajo", url: "/estibaje/ordenes", icon: Briefcase },
      { title: "Pagos Formales", url: "/estibaje/pagos", icon: CreditCard },
      { title: "Billetera Virtual", url: "/estibaje/billetera", icon: Wallet },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-sm shrink-0">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-sidebar-foreground leading-tight">La Parada</p>
            <p className="text-[11px] text-sidebar-foreground/60 leading-tight">
              Trazabilidad Logística
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] tracking-wider uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Cerrar sesión">
              <Link to="/auth" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
