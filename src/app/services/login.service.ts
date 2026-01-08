import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private platformId = inject(PLATFORM_ID);
  private loginUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.loginUrl, credentials)
      .pipe(
        tap((response: any) => {
          if (response.token && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
