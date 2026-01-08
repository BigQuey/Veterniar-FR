import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (loginService.isLoggedIn()) {
        return true;
    }

    // Redirect to login page if not authenticated
    router.navigate(['/login']);
    return false;
};
