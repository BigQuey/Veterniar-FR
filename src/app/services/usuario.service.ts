import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuario`;
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
  getOne(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
  create(usuario: Usuario) {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }
  getAllVeterinarios() {
    return this.http.get<Usuario[]>(`${this.apiUrl}/veterinario`);
  }
}
