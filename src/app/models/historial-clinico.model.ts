import { Mascota } from "./mascota.models";
import { Usuario } from "./usuario.model";

export interface HistorialClinico {
    id?: number;
    mascota?: Mascota;
    fecha?: string;
    diagnostico?: string;
    tratamiento?: string;
    observaciones?: string;
    veterinario?: Usuario;
    cita?: { id: number; fecha: string; hora: string; estado: string } | null;
}

export interface HistorialClinicoRequest {
    id?: number;
    diagnostico: string;
    tratamiento?: string;
    observaciones?: string;
    mascotaId: number;
    veterinarioId: number;
}
