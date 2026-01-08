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
}
