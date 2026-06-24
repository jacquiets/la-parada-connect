import { createFileRoute, redirect } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/logistica/camiones")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Comerciante" && user?.rol_nombre !== "Administrador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: () => (
    <ModulePlaceholder
      title="Programar Ingreso de Camión"
      description="Agenda el ingreso de unidades y asigna ventanas horarias."
      icon={Truck}
    />
  ),
});
