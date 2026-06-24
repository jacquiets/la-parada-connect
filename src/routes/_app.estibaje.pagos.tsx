import { createFileRoute, redirect } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/estibaje/pagos")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Comerciante" && user?.rol_nombre !== "Administrador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: () => (
    <ModulePlaceholder
      title="Pagos Formales"
      description="Realiza pagos formales por servicios de estibaje completados."
      icon={CreditCard}
    />
  ),
});
