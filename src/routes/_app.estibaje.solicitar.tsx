import { createFileRoute } from "@tanstack/react-router";
import { PackagePlus } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/estibaje/solicitar")({
  component: () => (
    <ModulePlaceholder
      title="Solicitar Servicio de Estibaje"
      description="Crea solicitudes de estibaje para tus cargas entrantes."
      icon={PackagePlus}
    />
  ),
});
