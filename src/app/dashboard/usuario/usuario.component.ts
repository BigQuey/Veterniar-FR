import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { extraerMensajeError } from '../../utils/error.util';

@Component({
  selector: 'app-usuario',
  imports: [ RouterModule, CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  usuario: Usuario[] = [];
  mensajeExito: string = '';
  error: string = '';
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  obtenerUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuario = usuarios;
      },
      error: (error) => {
        this.error = extraerMensajeError(error, 'No se pudieron cargar los usuarios');
      },
    });
  }
}
