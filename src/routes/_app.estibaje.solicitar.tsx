import { createFileRoute, redirect } from "@tanstack/react-router";
import { PackagePlus } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/estibaje/solicitar")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Comerciante" && user?.rol_nombre !== "Administrador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: () => (
    <ModulePlaceholder
      title="Solicitar Servicio de Estibaje"
      description="Crea solicitudes de estibaje para tus cargas entrantes."
      icon={PackagePlus}
    />
  ),
});
