import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistorialClinico } from '../models/historial-clinico.model';

@Injectable({
    providedIn: 'root',
})
export class HistorialClinicoService {
    private apiUrl = 'http://localhost:8080/api/historial-clinico';
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<HistorialClinico[]>(this.apiUrl);
    }

    getOne(id: number) {
        return this.http.get<HistorialClinico>(`${this.apiUrl}/${id}`);
    }

    create(historial: HistorialClinico) {
        return this.http.post<HistorialClinico>(this.apiUrl, historial);
    }

    update(id: number, historial: HistorialClinico) {
        return this.http.put<HistorialClinico>(`${this.apiUrl}/${id}`, historial);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
