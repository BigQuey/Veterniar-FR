import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  
  private loginUrl = 'http://localhost:8080/api/auth/login'; // URL que maneja el login (formLogin de Spring)
  private logoutUrl = 'http://localhost:8080/logout';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, { withCredentials: true });
  }

}
