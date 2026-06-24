import { createFileRoute } from "@tanstack/react-router";
import { UserCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/formalizacion/perfiles")({
  component: () => (
    <ModulePlaceholder
      title="Validar Perfiles"
      description="Revisa y aprueba la documentación de comerciantes y estibadores."
      icon={UserCheck}
    />
  ),
});
