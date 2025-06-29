import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario',
  imports: [ RouterModule, CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  usuario: Usuario[] = [];
  mensajeExito: string = '';
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  obtenerUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (usuarios: any) => {
        this.usuario = usuarios;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  eliminar(id: number| undefined) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuarioService.delete(id).subscribe(() => {
        this.obtenerUsuarios();
        this.mensajeExito = 'Usuario eliminado correctamente.';
        setTimeout(() => {
          this.mensajeExito = '';
        }, 1500);
      });
    }
  }
  
}
