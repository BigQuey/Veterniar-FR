import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../../../models/mascota.models';
import { MascotaService } from '../../../services/mascota.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DuenoService } from '../../../services/dueno.service';
import { Dueno } from '../../../models/dueno.model';

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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.mascotaService.update(id, this.mascota).subscribe(() => {
      this.router.navigate(['/dashboard/mascota']);
    });
  }
  volver(): void {
    this.location.back();
  }
}
