import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Truck, Plus, Calendar, Clock, MapPin, Package, Weight, 
  Loader2, AlertCircle, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";

import { getUser } from "@/lib/auth";
import { getProgramaciones, getMuelles, createProgramacion, ApiError } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/logistica/camiones")({
  beforeLoad: () => {
    const user = getUser();
    if (user?.rol_nombre !== "Comerciante" && user?.rol_nombre !== "Administrador") {
      throw redirect({ to: "/unauthorized" });
    }
  },
  head: () => ({
    meta: [{ title: "Programación de Camiones — La Parada" }],
  }),
  component: CamionesPage,
});

// ─── ESQUEMA ZOD ──────────────────────────────────────────────────────────────
const formSchema = z.object({
  muelle_id: z.string().min(1, "Debes seleccionar un muelle"),
  fecha_ingreso: z.string().min(1, "La fecha es requerida")
    .refine((val) => new Date(val) >= new Date(new Date().setHours(0,0,0,0)), {
      message: "No puedes seleccionar fechas pasadas",
    }),
  hora_ingreso: z.string().min(1, "La hora es requerida"),
  tipo_carga: z.string().min(3, "Mínimo 3 caracteres"),
  volumen_carga: z.coerce.number().positive("El volumen debe ser mayor a 0"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
function CamionesPage() {
  const user = getUser();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Consultas
  const { data: programaciones, isLoading, isError, refetch } = useQuery({
    queryKey: ["programaciones"],
    queryFn: getProgramaciones,
  });

  const { data: muelles, isLoading: isMuellesLoading } = useQuery({
    queryKey: ["muelles"],
    queryFn: getMuelles,
  });

  // Formulario
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_carga: "",
      volumen_carga: 0,
    }
  });

  // Mutación
  const { mutate, isPending } = useMutation({
    mutationFn: createProgramacion,
    onSuccess: () => {
      toast.success("Programación registrada con éxito");
      queryClient.invalidateQueries({ queryKey: ["programaciones"] });
      setIsModalOpen(false);
      reset();
    },
    onError: (error) => {
      const msg = error instanceof ApiError ? error.message : "Ocurrió un error inesperado";
      toast.error(msg);
    }
  });

  const onSubmit = (data: FormValues) => {
    // Formatear hora (si el input viene sin segundos)
    const payload = {
      ...data,
      hora_ingreso: data.hora_ingreso.length === 5 ? `${data.hora_ingreso}:00` : data.hora_ingreso,
    };
    mutate(payload);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Programado": return "bg-blue-100 text-blue-700";
      case "Completado": return "bg-emerald-100 text-emerald-700";
      case "Cancelado": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Programación de Ingreso de Camiones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.rol_nombre === "Administrador" 
              ? "Gestión global de camiones programados en el mercado."
              : "Registra y visualiza la llegada de tus vehículos."}
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) reset();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Nueva Programación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Programar Ingreso</DialogTitle>
              <DialogDescription>
                Llena los detalles del camión. Asegúrate de escoger una fecha y hora válidas.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="muelle">Muelle</Label>
                <Select onValueChange={(val) => setValue("muelle_id", val)}>
                  <SelectTrigger id="muelle" className={errors.muelle_id ? "border-red-500" : ""}>
                    <SelectValue placeholder={isMuellesLoading ? "Cargando..." : "Selecciona un muelle"} />
                  </SelectTrigger>
                  <SelectContent>
                    {muelles?.map(m => (
                      <SelectItem key={m.id} value={m.id} disabled={m.estado !== "Disponible"}>
                        {m.codigo} - {m.descripcion} {m.estado !== "Disponible" && "(No disponible)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.muelle_id && <p className="text-xs text-red-500">{errors.muelle_id.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" type="date" {...register("fecha_ingreso")} className={errors.fecha_ingreso ? "border-red-500" : ""} />
                  {errors.fecha_ingreso && <p className="text-xs text-red-500">{errors.fecha_ingreso.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Input id="hora" type="time" {...register("hora_ingreso")} className={errors.hora_ingreso ? "border-red-500" : ""} />
                  {errors.hora_ingreso && <p className="text-xs text-red-500">{errors.hora_ingreso.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Carga</Label>
                <Input id="tipo" placeholder="Ej. Frutas, Tubérculos..." {...register("tipo_carga")} className={errors.tipo_carga ? "border-red-500" : ""} />
                {errors.tipo_carga && <p className="text-xs text-red-500">{errors.tipo_carga.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="volumen">Volumen (Toneladas)</Label>
                <Input id="volumen" type="number" step="0.1" {...register("volumen_carga")} className={errors.volumen_carga ? "border-red-500" : ""} />
                {errors.volumen_carga && <p className="text-xs text-red-500">{errors.volumen_carga.message}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── LISTADO ─── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Registro de Programaciones</CardTitle>
            <CardDescription>Visualiza los camiones en el sistema.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-muted-foreground' : 'text-primary'}`} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Cargando programaciones...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-4" />
              <p>Ocurrió un error al cargar los datos.</p>
            </div>
          ) : programaciones?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">No hay programaciones</p>
              <p className="text-sm text-muted-foreground mt-1">Aún no tienes camiones programados para ingreso.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {programaciones?.map((prog) => (
                <div key={prog.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors gap-4">
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 hidden sm:flex">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {user?.rol_nombre === "Administrador" ? `${prog.usuarios?.nombres} ${prog.usuarios?.apellidos}` : "Camión Propio"}
                        </span>
                        <Badge variant="secondary" className={`${getStatusColor(prog.estado)} border-0 text-xs px-2 py-0.5`}>
                          {prog.estado}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>Muelle {prog.muelles?.codigo || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(new Date(prog.fecha_ingreso), "dd MMM, yyyy", { locale: es })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{prog.hora_ingreso.substring(0,5)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{prog.tipo_carga}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:mt-1">
                      <Weight className="h-3 w-3" />
                      <span>{prog.volumen_carga} Toneladas</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
