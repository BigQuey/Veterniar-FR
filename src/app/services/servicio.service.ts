import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servicio } from '../models/servicio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = 'http://localhost:8080/api/servicio';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  getOne(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(servicio: Servicio) {
    return this.http.post(this.apiUrl, servicio);
  }

  update(id: number, servicio: Servicio) {
    return this.http.put(`${this.apiUrl}`, servicio);
  }

  delete(id: number | undefined) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
