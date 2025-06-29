import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../../models/mascota.models';
import { MascotaService } from '../../services/mascota.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mascota',
  imports: [RouterModule, CommonModule],
  templateUrl: './mascota.component.html',
  styleUrl: './mascota.component.css',
})
export class MascotaComponent {
  mascota: Mascota[] = [];
  mensajeExito: string = '';
  constructor(private mascotaService: MascotaService) {}
  ngOnInit(): void {
    this.obtenerMascotas();
  }
  obtenerMascotas() {
    this.mascotaService.getAll().subscribe({
      next: (mascotas: any) => {
        this.mascota = mascotas;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  eliminar(id: number | undefined) {
    if (confirm('¿Seguro que deseas eliminar esta mascota?')) {
      this.mascotaService.delete(id).subscribe(() => {
        this.obtenerMascotas();
        this.mensajeExito = 'Mascota eliminado correctamente.';
        setTimeout(() => {
          this.mensajeExito = '';
        }, 1500);
      });
    }
  }
}
