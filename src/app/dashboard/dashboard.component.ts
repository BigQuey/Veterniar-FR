import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ServicioService } from '../services/servicio.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);

  constructor(private loginService: LoginService, private router: Router, private servicioService: ServicioService) { }

  username: string | null = null;
  rol: string | null = null;
  cantidadServicios: number = 0;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username');
      this.rol = localStorage.getItem('rol');

      this.getCantidadServicios().subscribe({
        next: (cantidad) => {
          this.cantidadServicios = cantidad;
        },
        error: (error) => {
          console.error('Error al obtener la cantidad de servicios', error);
        }
      });
    }
  }

  logout(): void {

    localStorage.removeItem('username');
    localStorage.removeItem('rol');

    this.loginService.logout();
    this.router.navigate(['/login']);
  }
  getCantidadServicios(): Observable<number> {
    const res = this.servicioService.getAll().pipe(
      map(servicios => servicios.length)
    )
    return res;
  }
}