import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuario';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get(this.apiUrl);
  }
  create(usuario: Usuario) {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }
  delete(id: number | undefined) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  getAllVeterinarios() {
    return this.http.get(`${this.apiUrl}/veterinario`);
  }
}
