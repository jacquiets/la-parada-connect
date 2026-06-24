import { createFileRoute, redirect } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/estibaje/ordenes")({
  beforeLoad: () => {
    const user = getUser();
    if (!["Comerciante", "Estibador", "Administrador"].includes(user?.rol_nombre || "")) {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: () => (
    <ModulePlaceholder
      title="Órdenes de Trabajo"
      description="Acepta órdenes asignadas y confirma los servicios prestados."
      icon={Briefcase}
    />
  ),
});
