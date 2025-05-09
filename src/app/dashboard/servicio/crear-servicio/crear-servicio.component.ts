import { Component } from '@angular/core';
import { Servicio } from '../../../models/servicio.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../../services/servicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-servicio',
  imports: [CommonModule,FormsModule],
  templateUrl: './crear-servicio.component.html',
  styleUrl: './crear-servicio.component.css'
})
export class CrearServicioComponent {
  servicio: Servicio = {nombre:'', precio:0};
  constructor(private servicioService: ServicioService, private router: Router) { }

  guardar() {
    this.servicioService.create(this.servicio).subscribe(() =>  {
      this.router.navigate(['/dashboard/servicio']);
    });
}
}
