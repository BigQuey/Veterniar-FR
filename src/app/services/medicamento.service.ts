import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Medicamento } from '../models/medicamento.model';

@Injectable({
    providedIn: 'root',
})
export class MedicamentoService {
    private apiUrl = 'http://localhost:8080/api/medicamento';
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Medicamento[]>(this.apiUrl);
    }

    getOne(id: number) {
        return this.http.get<Medicamento>(`${this.apiUrl}/${id}`);
    }

    create(medicamento: Medicamento) {
        return this.http.post<Medicamento>(this.apiUrl, medicamento);
    }

    update(id: number, medicamento: Medicamento) {
        return this.http.put<Medicamento>(`${this.apiUrl}/${id}`, medicamento);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
