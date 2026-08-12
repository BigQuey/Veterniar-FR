import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);

    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('token');

        if (token) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

            return next(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        localStorage.removeItem('rol');
                        router.navigate(['/login']);
                    }
                    return throwError(() => error);
                })
            );
        }
    }

    return next(req);
};
