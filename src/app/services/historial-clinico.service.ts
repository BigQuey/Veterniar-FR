import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistorialClinico, HistorialClinicoRequest } from '../models/historial-clinico.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HistorialClinicoService {
    private apiUrl = `${environment.apiUrl}/historial-clinico`;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<HistorialClinico[]>(this.apiUrl);
    }

    getOne(id: number) {
        return this.http.get<HistorialClinico>(`${this.apiUrl}/${id}`);
    }

    create(historial: HistorialClinicoRequest) {
        return this.http.post<HistorialClinico>(this.apiUrl, historial);
    }

    createDesdeCita(citaId: number, historial: HistorialClinicoRequest) {
        return this.http.post<HistorialClinico>(`${this.apiUrl}/cita/${citaId}`, historial);
    }

    update(id: number, historial: HistorialClinicoRequest) {
        return this.http.put<HistorialClinico>(`${this.apiUrl}/${id}`, historial);
    }

    getPorMascota(mascotaId: number) {
        return this.http.get<HistorialClinico[]>(`${this.apiUrl}/mascota/${mascotaId}`);
    }

    getPorVeterinario(veterinarioId: number) {
        return this.http.get<HistorialClinico[]>(`${this.apiUrl}/veterinario/${veterinarioId}`);
    }
}
