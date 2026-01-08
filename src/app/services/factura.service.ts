import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = 'http://localhost:8080/api/factura';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  getOne(id: number) {
    return this.http.get<Factura>(`${this.apiUrl}/${id}`);
  }

  create(factura: Factura) {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  update(id: number, factura: Factura) {
    return this.http.put<Factura>(this.apiUrl, factura);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateEstado(id: number, factura: Factura) {
    return this.http.put<Factura>(`${this.apiUrl}/${id}/estado`, factura.estadoPago);
  }
}
