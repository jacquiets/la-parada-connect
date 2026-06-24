import { createFileRoute, redirect } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/estibaje/billetera")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Estibador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: () => (
    <ModulePlaceholder
      title="Billetera Virtual"
      description="Gestiona tu saldo, recargas y movimientos."
      icon={Wallet}
    />
  ),
});
