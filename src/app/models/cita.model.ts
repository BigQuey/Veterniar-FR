import { Usuario } from "./usuario.model";

export interface Cita {
    id?: number;
    fecha?: string;
    hora?: string;
    mascota?: { id: number; nombre: string; especie: string; sexo: string };
    veterinario?: { id: number; username: string; rol: string };
    motivo?: string;
    estado?: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
}

export interface CitaRequest {
    fecha: string;
    hora: string;
    mascotaId: number;
    veterinarioId: number;
    motivo?: string;
}
