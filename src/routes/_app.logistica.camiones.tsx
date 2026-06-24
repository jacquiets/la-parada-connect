import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/logistica/camiones")({
  component: () => (
    <ModulePlaceholder
      title="Programar Ingreso de Camión"
      description="Agenda el ingreso de unidades y asigna ventanas horarias."
      icon={Truck}
    />
  ),
});
