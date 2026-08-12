import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mascota, MascotaRequest } from '../models/mascota.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private apiUrl = `${environment.apiUrl}/mascota`;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  getOne(id: number) {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  create(mascota: MascotaRequest) {
    return this.http.post<Mascota>(this.apiUrl, mascota);
  }

  update(mascota: MascotaRequest) {
    return this.http.put<Mascota>(this.apiUrl, mascota);
  }

  delete(id: number | undefined) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPorDueno(duenoId: number) {
    return this.http.get<Mascota[]>(`${this.apiUrl}/dueno/${duenoId}`);
  }
}
