import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/estibaje/billetera")({
  component: () => (
    <ModulePlaceholder
      title="Billetera Virtual"
      description="Gestiona tu saldo, recargas y movimientos."
      icon={Wallet}
    />
  ),
});
