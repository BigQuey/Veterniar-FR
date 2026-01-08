import { Component } from '@angular/core';
import { Mascota } from '../../../models/mascota.models';
import { MascotaService } from '../../../services/mascota.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dueno } from '../../../models/dueno.model';
import { DuenoService } from '../../../services/dueno.service';

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
  constructor(private mascotaService: MascotaService, private router: Router, private duenoService: DuenoService) { }
  ngOnInit() {
    this.duenoService.getAll().subscribe((data: any) => {
      this.duenos = data;
    });
  }
  guardar() {

    this.mascotaService.create(this.mascota).subscribe(() => {
      this.router.navigate(['/dashboard/mascota']);
    });
  }
}
