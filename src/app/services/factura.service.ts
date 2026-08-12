import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Factura, FacturaRequest } from '../models/factura.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = `${environment.apiUrl}/factura`;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  getOne(id: number) {
    return this.http.get<Factura>(`${this.apiUrl}/${id}`);
  }

  create(factura: FacturaRequest) {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  update(factura: FacturaRequest) {
    return this.http.put<Factura>(this.apiUrl, factura);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cambiarEstado(id: number, estado: 'PAGADO' | 'PENDIENTE') {
    return this.http.put<Factura>(`${this.apiUrl}/${id}/estado`, null, { params: { estado } });
  }
}
