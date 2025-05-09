import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dueno } from '../models/dueno.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DuenoService {
  private apiUrl = 'http://localhost:8080/api/dueno';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Dueno[]> {
    return this.http.get<Dueno[]>(this.apiUrl);
  }

  getOne(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(dueno: Dueno) {
    return this.http.post(this.apiUrl, dueno);
  }

  update(id: number, dueno: Dueno) {
    return this.http.put(`${this.apiUrl}`, dueno);
  }

  delete(id: number | undefined) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
