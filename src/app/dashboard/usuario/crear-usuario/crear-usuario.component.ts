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
  usuario: Usuario = { username: '', password: '', rol: '' };
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    // Aquí puedes inicializar cualquier dato necesario
  }

  guardar() {
    this.usuarioService.create(this.usuario).subscribe(() => {
        this.router.navigate(['/dashboard/usuario']);
      }
    );
  }
}
