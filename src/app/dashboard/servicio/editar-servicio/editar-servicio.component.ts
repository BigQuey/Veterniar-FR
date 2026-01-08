import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Servicio } from '../../../models/servicio.model';
import { ServicioService } from '../../../services/servicio.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-servicio',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-servicio.component.html',
  styleUrl: './editar-servicio.component.css'
})
export class EditarServicioComponent {
  servicio!: Servicio;

  constructor(
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.servicioService.getOne(id).subscribe((data: any) => {
      this.servicio = data;
    });
  }

  actualizar() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.servicioService.update(id, this.servicio).subscribe(() => {
      this.router.navigate(['/dashboard/servicio']);
    });
  }
}
