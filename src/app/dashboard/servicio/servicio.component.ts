import { Component } from '@angular/core';
import { Servicio } from '../../models/servicio.model';
import { ServicioService } from '../../services/servicio.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { extraerMensajeError } from '../../utils/error.util';

@Component({
  selector: 'app-servicio',
  imports: [CommonModule, RouterModule],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent {
  servicios: Servicio[] = [];
  mensajeExito: string = '';
  error: string = '';

  constructor(private servicioService: ServicioService) { }

  get esAdmin(): boolean {
    return localStorage.getItem('rol') === 'ADMIN';
  }

  ngOnInit(): void {
      this.obtenerServicios();
  }

  obtenerServicios(){
      this.servicioService.getAll().subscribe({
          next: (servicios: Servicio[]) => {
              this.servicios = servicios;
          },
          error: (error) => {
              this.error = extraerMensajeError(error, 'No se pudieron cargar los servicios');
          }
      });
  }

  eliminar(id: number | undefined) {
      if (confirm('¿Seguro que deseas eliminar este servicio?')) {
        this.servicioService.delete(id).subscribe({
          next: () => {
            this.obtenerServicios();
            this.mensajeExito = 'Servicio eliminado correctamente.';
            setTimeout(() => {
                this.mensajeExito = '';
              }, 1500);
          },
          error: (error) => {
            this.error = extraerMensajeError(error, 'No se pudo eliminar el servicio');
          }
        });
      }
  }
}
