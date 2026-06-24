const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  auth_user_id: string;
  nombres: string;
  apellidos: string;
  telefono?: string | null;
  rol_id: string;
  rol_nombre?: string | null;
  estado: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface RegisterPayload {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  rol_nombre: string;
  telefono?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface MuelleResponse {
  id: string;
  codigo: string;
  descripcion: string;
  capacidad_camiones: number;
  estado: string;
}

export interface ProgramacionResponse {
  id: string;
  fecha_ingreso: string;
  hora_ingreso: string;
  tipo_carga: string;
  volumen_carga: number;
  estado: string;
  muelle_id: string;
  usuario_id: string;
  usuarios?: { nombres: string; apellidos: string };
  muelles?: { codigo: string };
}

export interface ProgramacionCreatePayload {
  muelle_id: string;
  fecha_ingreso: string;
  hora_ingreso: string;
  tipo_carga: string;
  volumen_carga: number;
}

// ─── API Error ────────────────────────────────────────────────────────────────

import { getToken } from "./auth";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({ detail: "Error desconocido" }));

  if (!res.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((e: { msg: string }) => e.msg).join(", ")
          : "Error en la solicitud";
    throw new ApiError(res.status, message);
  }

  return data as T;
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export function authRegister(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function authLogin(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Logística endpoints ──────────────────────────────────────────────────────

export function getMuelles(): Promise<MuelleResponse[]> {
  return request<MuelleResponse[]>("/api/v1/muelles", {
    method: "GET",
  });
}

export function getProgramaciones(): Promise<ProgramacionResponse[]> {
  return request<ProgramacionResponse[]>("/api/v1/programaciones", {
    method: "GET",
  });
}

export function createProgramacion(payload: ProgramacionCreatePayload): Promise<ProgramacionResponse> {
  return request<ProgramacionResponse>("/api/v1/programaciones", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
