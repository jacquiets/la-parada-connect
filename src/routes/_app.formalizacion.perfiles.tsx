import { createFileRoute, redirect } from "@tanstack/react-router";
import { UserCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/formalizacion/perfiles")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Administrador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: () => (
    <ModulePlaceholder
      title="Validar Perfiles"
      description="Revisa y aprueba la documentación de comerciantes y estibadores."
      icon={UserCheck}
    />
  ),
});
