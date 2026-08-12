import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota, MascotaRequest } from '../../../models/mascota.models';
import { MascotaService } from '../../../services/mascota.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DuenoService } from '../../../services/dueno.service';
import { Dueno } from '../../../models/dueno.model';
import { extraerMensajeError } from '../../../utils/error.util';

@Component({
  selector: 'app-editar-mascota',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './editar-mascota.component.html',
  styleUrl: './editar-mascota.component.css'
})
export class EditarMascotaComponent {
  mascota!: Mascota;
  duenos: Dueno[] = [];
  duenoNombre: string = '';
  error = '';
  constructor(
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.mascotaService.getOne(id).subscribe((data: any) => {
      this.mascota = data;
      if (!this.mascota.dueno) {
        this.mascota.dueno = { id: undefined, nombre: '', direccion: '', telefono: '' };
      }
      this.duenoNombre = this.mascota?.dueno?.nombre || '';
      if (this.mascota.fechaNacimiento) {
        this.mascota.fechaNacimiento = this.mascota.fechaNacimiento.split('T')[0];
      }
    });

    this.duenoService.getAll().subscribe((data: any) => {
      this.duenos = data;
    });
  }

  actualizar() {
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

    this.mascotaService.update(request).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/mascota']);
      },
      error: (err) => {
        this.error = extraerMensajeError(err, 'No se pudo actualizar la mascota');
      }
    });
  }
  volver(): void {
    this.location.back();
  }
}
