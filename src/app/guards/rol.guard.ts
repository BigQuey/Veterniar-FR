import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RolUsuario } from '../models/usuario.model';

export function rolGuard(rolesPermitidos: RolUsuario[]): CanActivateFn {
    return () => {
        const loginService = inject(LoginService);
        const router = inject(Router);

        if (!loginService.isLoggedIn()) {
            router.navigate(['/login']);
            return false;
        }

        const rol = localStorage.getItem('rol') as RolUsuario | null;
        if (rol && rolesPermitidos.includes(rol)) {
            return true;
        }

        router.navigate(['/dashboard/home']);
        return false;
    };
}
