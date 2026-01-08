import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    usuario: Usuario = {
        username: '',
        password: '',
        rol: 'USER' // Rol por defecto
    };
    confirmPassword = '';
    error = '';
    loading = false;

    constructor(private usuarioService: UsuarioService, private router: Router) { }

    onSubmit() {
        if (!this.usuario.username || !this.usuario.password) {
            this.error = 'Por favor completa todos los campos';
            return;
        }

        if (this.usuario.password !== this.confirmPassword) {
            this.error = 'Las contraseñas no coinciden';
            return;
        }

        this.loading = true;
        this.error = '';

        this.usuarioService.create(this.usuario).subscribe({
            next: (response) => {
                console.log('Usuario registrado con éxito', response);
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Error al registrar usuario', err);
                this.error = 'Error al registrar el usuario. El nombre de usuario puede que ya exista.';
                this.loading = false;
            }
        });
    }
}
