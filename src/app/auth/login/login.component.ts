import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        localStorage.setItem('username', response.username);
        localStorage.setItem('rol', response.rol);
        this.router.navigate(['/dashboard/home'])
      },
      error: (err) => {
        // console.log("Error" + JSON.stringify(e))
        console.error('Login fallido', err);
        this.error = 'Credenciales incorrectas'
      }
    });
  }
}
