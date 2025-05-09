import { Dueno } from "./dueno.model";

export interface Mascota {
    id?: number;
    nombre?: string;
    especie?: string;
    raza?: string;
    dueno?: Dueno;
}