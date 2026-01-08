import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
    providedIn: 'root',
})
export class CitaService {
    private apiUrl = 'http://localhost:8080/api/cita';
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Cita[]>(this.apiUrl);
    }

    getOne(id: number) {
        return this.http.get<Cita>(`${this.apiUrl}/${id}`);
    }

    create(cita: Cita) {
        return this.http.post<Cita>(this.apiUrl, cita);
    }

    update(id: number, cita: Cita) {
        return this.http.put<Cita>(`${this.apiUrl}/${id}`, cita);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
