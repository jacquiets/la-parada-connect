import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/estibaje/ordenes")({
  component: () => (
    <ModulePlaceholder
      title="Órdenes de Trabajo"
      description="Acepta órdenes asignadas y confirma los servicios prestados."
      icon={Briefcase}
    />
  ),
});
