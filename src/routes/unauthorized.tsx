import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [{ title: "Acceso Denegado — La Parada" }],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Acceso Denegado
        </h1>
        <p className="mb-8 text-muted-foreground">
          No tienes los permisos necesarios para ver esta página o realizar esta acción.
          Contacta al administrador si crees que esto es un error.
        </p>
        <Button asChild className="gap-2 shadow-sm">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
