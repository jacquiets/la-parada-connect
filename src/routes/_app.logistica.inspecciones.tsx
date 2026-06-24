import { createFileRoute, redirect } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/logistica/inspecciones")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Administrador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: () => (
    <ModulePlaceholder
      title="Inspecciones de Salubridad"
      description="Registra y consulta inspecciones de salubridad por unidad."
      icon={ClipboardList}
    />
  ),
});
