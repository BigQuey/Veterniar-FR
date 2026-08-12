import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Medicamento } from '../models/medicamento.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MedicamentoService {
    private apiUrl = `${environment.apiUrl}/medicamento`;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Medicamento[]>(this.apiUrl);
    }

    getOne(id: number) {
        return this.http.get<Medicamento>(`${this.apiUrl}/${id}`);
    }

    buscarPorNombre(nombre: string) {
        return this.http.get<Medicamento[]>(`${this.apiUrl}/buscar`, { params: { nombre } });
    }

    create(medicamento: Medicamento) {
        return this.http.post<Medicamento>(this.apiUrl, medicamento);
    }

    update(medicamento: Medicamento) {
        return this.http.put<Medicamento>(this.apiUrl, medicamento);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
