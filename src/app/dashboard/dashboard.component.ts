import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private loginService: LoginService, private router: Router) { }
  username: string | null = null;
  rol: string | null = null;
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.rol = localStorage.getItem('rol');
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
}