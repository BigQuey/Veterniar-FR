import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cita, CitaRequest } from '../models/cita.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CitaService {
    private apiUrl = `${environment.apiUrl}/cita`;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Cita[]>(this.apiUrl);
    }

    getOne(id: number) {
        return this.http.get<Cita>(`${this.apiUrl}/${id}`);
    }

    create(cita: CitaRequest) {
        return this.http.post<Cita>(this.apiUrl, cita);
    }

    cambiarEstado(id: number, estado: string) {
        return this.http.put<Cita>(`${this.apiUrl}/${id}/estado?estado=${estado}`, null);
    }

    cancelar(id: number) {
        return this.http.put<Cita>(`${this.apiUrl}/${id}/cancelar`, null);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getPorVeterinario(id: number) {
        return this.http.get<Cita[]>(`${this.apiUrl}/veterinario/${id}`);
    }

    getPorMascota(id: number) {
        return this.http.get<Cita[]>(`${this.apiUrl}/mascota/${id}`);
    }

    getPorFecha(fecha: string) {
        return this.http.get<Cita[]>(`${this.apiUrl}/fecha`, { params: { fecha } });
    }

    getAgenda(veterinarioId: number, fecha: string) {
        return this.http.get<Cita[]>(`${this.apiUrl}/agenda`, { params: { veterinarioId, fecha } });
    }

    getPendientes() {
        return this.http.get<Cita[]>(`${this.apiUrl}/pendientes`);
    }
}
