import { Mascota } from "./mascota.models";
import { Dueno } from "./dueno.model";
import { Usuario } from "./usuario.model";

export interface Cita {
    id?: number;
    fecha?: string;
    hora?: string;
    mascota?: Mascota;
    dueno?: Dueno;
    veterinario?: Usuario;
    motivo?: string;
    estado?: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
}
