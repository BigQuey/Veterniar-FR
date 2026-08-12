import { HttpErrorResponse } from '@angular/common/http';

export interface BackendFieldError {
    field: string;
    message: string;
}

export interface BackendError {
    message: string;
    fieldErrors?: BackendFieldError[];
}

export function extraerMensajeError(error: unknown, fallback = 'Ha ocurrido un error inesperado'): string {
    if (error instanceof HttpErrorResponse && error.error) {
        const body = error.error as BackendError;
        if (body && body.message) {
            return body.message;
        }
    }
    return fallback;
}

export function extraerFieldErrors(error: unknown): BackendFieldError[] {
    if (error instanceof HttpErrorResponse && error.error) {
        const body = error.error as BackendError;
        if (body && Array.isArray(body.fieldErrors)) {
            return body.fieldErrors;
        }
    }
    return [];
}
