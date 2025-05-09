import { Component } from '@angular/core';
import { Servicio } from '../../models/servicio.model';
import { ServicioService } from '../../services/servicio.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicio',
  imports: [CommonModule, RouterModule],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent {
  servicios: Servicio[] = [];
  mensajeExito: string = '';
  
  constructor(private servicioService: ServicioService) { }
  
  ngOnInit(): void {
      this.obtenerServicios();
  }

  obtenerServicios(){
      this.servicioService.getAll().subscribe({
          next: (servicios: any) => {
              this.servicios = servicios;
          },
          error: (error) => {
              console.log(error);
          }
      });
  }

  eliminar(id: number | undefined) {
      if (confirm('¿Seguro que deseas eliminar este servicio?')) {
        this.servicioService.delete(id).subscribe(() => {
          this.obtenerServicios();
          this.mensajeExito = 'Servicio eliminado correctamente.';
          setTimeout(() => {
              this.mensajeExito = '';
            }, 1500);
        });
      }
  }
}
