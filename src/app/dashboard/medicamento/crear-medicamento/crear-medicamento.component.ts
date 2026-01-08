import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MedicamentoService } from '../../../services/medicamento.service';
import { Medicamento } from '../../../models/medicamento.model';

@Component({
    selector: 'app-crear-medicamento',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './crear-medicamento.component.html',
    styleUrl: './crear-medicamento.component.css'
})
export class CrearMedicamentoComponent {
    medicamento: Medicamento = {
        nombre: '',
        descripcion: '',
        cantidadStock: 0,
        precio: 0
    };

    constructor(
        private medicamentoService: MedicamentoService,
        private router: Router
    ) { }

    guardar(): void {
        this.medicamentoService.create(this.medicamento).subscribe(() => {
            this.router.navigate(['/dashboard/medicamento']);
        });
    }
}
