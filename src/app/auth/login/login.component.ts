import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit() {
    if (this.username == '' || this.password == '') {
      this.error = 'Por favor, completa todos los campos'
      return;
    }
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.loginService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('username', response.username);
        localStorage.setItem('rol', response.rol);
        this.router.navigate(['/dashboard/home'])
      },
      error: (err) => {
        this.error = 'Credenciales incorrectas'
      }
    });
  }
}
