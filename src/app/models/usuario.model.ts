export interface Usuario {
    id?: number;
    username?: string;
    password?: string;
    rol?: 'ADMIN' | 'EMPLEADO' | 'VETERINARIO';
}

export type RolUsuario = 'ADMIN' | 'EMPLEADO' | 'VETERINARIO';
