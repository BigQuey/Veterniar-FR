import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../services/servicio.service';
import { get } from 'http';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private loginService: LoginService, private router: Router, private servicioService: ServicioService) { }
  username: string | null = null;
  rol: string | null = null;
  cantidadServicios: number = 0;
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.rol = localStorage.getItem('rol');
    this.getCantidadServicios().subscribe({
      next: (cantidad) => {
        console.log("Cantidad de servicios: ", cantidad);
        this.cantidadServicios = cantidad;
      },
      error: (error) => {
        console.error('Error al obtener la cantidad de servicios', error);
      }
    });
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {

        localStorage.removeItem('username');
        localStorage.removeItem('rol');


        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
      }
    });
  }
  getCantidadServicios(): Observable<number> {
    const res = this.servicioService.getAll().pipe(
      map(servicios => servicios.length)
    )
    return res ;
  }
}