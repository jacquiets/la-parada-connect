import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Truck, ShieldCheck, PackageCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso — La Parada" },
      { name: "description", content: "Inicia sesión o regístrate en el Sistema de Gestión y Trazabilidad Logística de La Parada." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden bg-[var(--brand-dark)]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.55 0.19 258 / 0.6), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.4 0.12 260 / 0.5), transparent 50%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">La Parada</p>
            <p className="text-base font-semibold">Trazabilidad Logística</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">
            Logística formal, segura y trazable para el mercado.
          </h1>
          <p className="mt-4 text-white/70">
            Centraliza la formalización, el ingreso de camiones, las
            inspecciones y el estibaje en una sola plataforma.
          </p>

          <div className="mt-10 space-y-4">
            <Feature icon={<ShieldCheck className="h-4 w-4" />} text="Validación de perfiles y cumplimiento" />
            <Feature icon={<Truck className="h-4 w-4" />} text="Programación de ingreso de camiones" />
            <Feature icon={<PackageCheck className="h-4 w-4" />} text="Órdenes de estibaje y pagos formales" />
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} La Parada · Sistema de Gestión Logística
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">La Parada</p>
          </div>

          <h2 className="text-2xl font-semibold text-foreground">Bienvenido</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Accede a tu cuenta o crea una nueva para empezar.
          </p>

          <Tabs defaultValue="login" className="mt-8">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Correo</Label>
                  <Input id="login-email" type="email" placeholder="tu@correo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input id="login-password" type="password" placeholder="••••••••" required />
                </div>
                <div className="flex items-center justify-end">
                  <button type="button" className="text-xs text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <Button type="submit" className="w-full shadow-sm">
                  Iniciar Sesión
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Nombres</Label>
                    <Input id="reg-name" placeholder="Juan" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-lastname">Apellidos</Label>
                    <Input id="reg-lastname" placeholder="Pérez" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Correo</Label>
                  <Input id="reg-email" type="email" placeholder="tu@correo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input id="reg-password" type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-role">Rol</Label>
                  <Select defaultValue="comerciante">
                    <SelectTrigger id="reg-role">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comerciante">Comerciante</SelectItem>
                      <SelectItem value="estibador">Estibador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full shadow-sm">
                  Crear Cuenta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-white">
        {icon}
      </div>
      <p className="text-sm text-white/85">{text}</p>
    </div>
  );
}
