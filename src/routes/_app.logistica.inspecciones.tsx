import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/logistica/inspecciones")({
  component: () => (
    <ModulePlaceholder
      title="Inspecciones de Salubridad"
      description="Registra y consulta inspecciones de salubridad por unidad."
      icon={ClipboardList}
    />
  ),
});
