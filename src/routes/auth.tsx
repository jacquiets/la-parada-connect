import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Truck, ShieldCheck, PackageCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { PasswordStrength } from "@/components/PasswordStrength";

import { authRegister, authLogin, ApiError } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50, "Máximo 50 caracteres"),
  lastname: z.string().min(1, "El apellido es requerido").max(50, "Máximo 50 caracteres"),
  email: z.string().email("Correo electrónico inválido").max(100, "Máximo 100 caracteres"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(64, "Máximo 64 caracteres")
    .regex(/[A-Z]/, "Debe contener una mayúscula")
    .regex(/[a-z]/, "Debe contener una minúscula")
    .regex(/[0-9]/, "Debe contener un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener un símbolo"),
  role: z.enum(["Comerciante", "Estibador"]),
});

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

import { isAuthenticated } from "@/lib/auth";

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Acceso — La Parada" },
      { name: "description", content: "Inicia sesión o regístrate en el Sistema de Gestión y Trazabilidad Logística de La Parada." },
    ],
  }),
  component: AuthPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function AuthPage() {
  const navigate = useNavigate();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // ── Login form ──────────────────────────────────────────────────────────────
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => authLogin({ email: data.email, password: data.password }),
    onSuccess: (res) => {
      saveToken(res.access_token);
      saveUser(res.user);
      toast.success("¡Bienvenido de vuelta!");
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Error de conexión al servidor.");
      }
    },
  });

  const onLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // ── Register form ───────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit: handleRegisterSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "Comerciante",
    },
    mode: "onChange",
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) =>
      authRegister({
        nombres: data.name,
        apellidos: data.lastname,
        email: data.email,
        password: data.password,
        rol_nombre: data.role,
      }),
    onSuccess: (res) => {
      saveToken(res.access_token);
      saveUser(res.user);
      toast.success("¡Cuenta creada exitosamente!");
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Error de conexión al servidor.");
      }
    },
  });

  const onRegister = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  const currentPassword = watch("password");

  // ── Render ──────────────────────────────────────────────────────────────────

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

            {/* ── Login ── */}
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Correo</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@correo.com"
                    maxLength={100}
                    {...registerLogin("email")}
                  />
                  {loginErrors.email && (
                    <p className="text-xs text-red-500">{loginErrors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      maxLength={64}
                      className="pr-10"
                      {...registerLogin("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs text-red-500">{loginErrors.password.message}</p>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  <button type="button" className="text-xs text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Error de API */}
                {loginMutation.isError && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {loginMutation.error instanceof ApiError ? loginMutation.error.message : "Error de conexión al servidor."}
                  </p>
                )}

                <Button type="submit" className="w-full shadow-sm" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Iniciando sesión…
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* ── Register ── */}
            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Nombres</Label>
                    <Input id="reg-name" placeholder="Juan" maxLength={50} {...register("name")} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-lastname">Apellidos</Label>
                    <Input id="reg-lastname" placeholder="Pérez" maxLength={50} {...register("lastname")} />
                    {errors.lastname && <p className="text-xs text-red-500">{errors.lastname.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Correo</Label>
                  <Input id="reg-email" type="email" placeholder="tu@correo.com" maxLength={100} {...register("email")} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      type={showRegisterPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      maxLength={64} 
                      className="pr-10"
                      {...register("password")} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={currentPassword} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-role">Rol</Label>
                  <Select
                    defaultValue="Comerciante"
                    onValueChange={(value) => setValue("role", value as "Comerciante" | "Estibador")}
                  >
                    <SelectTrigger id="reg-role">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Comerciante">Comerciante</SelectItem>
                      <SelectItem value="Estibador">Estibador</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                </div>

                {/* Error de API */}
                {registerMutation.isError && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {registerMutation.error instanceof ApiError ? registerMutation.error.message : "Error de conexión al servidor."}
                  </p>
                )}

                <Button type="submit" className="w-full shadow-sm" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando cuenta…
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
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
