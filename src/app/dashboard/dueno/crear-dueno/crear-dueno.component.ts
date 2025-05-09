import { Component } from '@angular/core';
import { Dueno } from '../../../models/dueno.model';
import { DuenoService } from '../../../services/dueno.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-crear-dueno',
  imports: [CommonModule,FormsModule],
  templateUrl: './crear-dueno.component.html',
  styleUrl: './crear-dueno.component.css'
})
export class CrearDuenoComponent {
  dueno: Dueno = { nombre: '', direccion: '', telefono: '' };

  constructor(private duenoService: DuenoService, private router: Router) { }

  guardar() {
    this.duenoService.create(this.dueno).subscribe(() => {
      this.router.navigate(['/dashboard/dueno']);
    });
  }
}
