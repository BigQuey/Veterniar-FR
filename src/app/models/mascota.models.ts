import { Dueno } from "./dueno.model";

export interface Mascota {
    id?: number;
    nombre?: string;
    especie?: string;
    raza?: string;
    fechaNacimiento?: string;
    peso?: number;
    sexo?: 'MACHO' | 'HEMBRA';
    color?: string;
    caracteristicas?: string;
    dueno?: Dueno;
}

export interface MascotaRequest {
    id?: number;
    nombre: string;
    especie: string;
    raza?: string;
    fechaNacimiento?: string;
    peso: number;
    sexo?: 'MACHO' | 'HEMBRA';
    color?: string;
    caracteristicas?: string;
    duenoId: number;
}
