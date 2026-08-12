import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css',
})
export class CrearUsuarioComponent {
  usuario: Usuario = { username: '', password: '', rol: undefined };
  error = '';
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    // Aquí puedes inicializar cualquier dato necesario
  }

  guardar() {
    this.error = '';
    if (!this.usuario.username || !this.usuario.password) {
      this.error = 'El username y la contraseña son obligatorios';
      return;
    }
    if (!this.usuario.rol) {
      this.error = 'Selecciona un rol para el usuario';
      return;
    }
    this.usuarioService.create(this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/usuario']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo crear el usuario';
      }
    });
  }
}
