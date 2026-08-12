import { Component } from '@angular/core';
import { Mascota, MascotaRequest } from '../../../models/mascota.models';
import { MascotaService } from '../../../services/mascota.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dueno } from '../../../models/dueno.model';
import { DuenoService } from '../../../services/dueno.service';
import { extraerMensajeError } from '../../../utils/error.util';

@Component({
  selector: 'app-crear-mascota',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-mascota.component.html',
  styleUrl: './crear-mascota.component.css'
})
export class CrearMascotaComponent {
  mascota: Mascota = {
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    peso: undefined,
    sexo: 'MACHO',
    color: '',
    caracteristicas: '',
    dueno: { id: undefined }
  };
  duenos: Dueno[] = [];
  error = '';
  constructor(private mascotaService: MascotaService, private router: Router, private duenoService: DuenoService) { }
  ngOnInit() {
    this.duenoService.getAll().subscribe((data: any) => {
      this.duenos = data;
    });
  }
  guardar() {
    if (this.mascota.peso === undefined || this.mascota.peso === null || this.mascota.dueno?.id === undefined) {
      this.error = 'El peso y el dueño son obligatorios';
      return;
    }

    const request: MascotaRequest = {
      id: this.mascota.id,
      nombre: this.mascota.nombre!,
      especie: this.mascota.especie!,
      raza: this.mascota.raza,
      fechaNacimiento: this.mascota.fechaNacimiento,
      peso: this.mascota.peso,
      sexo: this.mascota.sexo,
      color: this.mascota.color,
      caracteristicas: this.mascota.caracteristicas,
      duenoId: this.mascota.dueno!.id
    };

    this.mascotaService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/mascota']);
      },
      error: (err) => {
        this.error = extraerMensajeError(err, 'No se pudo crear la mascota');
      }
    });
  }
}
