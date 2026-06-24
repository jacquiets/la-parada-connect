import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/estibaje/pagos")({
  component: () => (
    <ModulePlaceholder
      title="Pagos Formales"
      description="Realiza pagos formales por servicios de estibaje completados."
      icon={CreditCard}
    />
  ),
});
