import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MedicamentoService } from '../../../services/medicamento.service';
import { Medicamento } from '../../../models/medicamento.model';

@Component({
    selector: 'app-editar-medicamento',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './editar-medicamento.component.html',
    styleUrl: './editar-medicamento.component.css'
})
export class EditarMedicamentoComponent implements OnInit {
    medicamento: Medicamento = {
        nombre: '',
        descripcion: '',
        cantidadStock: 0,
        precio: 0
    };

    constructor(
        private medicamentoService: MedicamentoService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.medicamentoService.getOne(id).subscribe({
                next: (data) => {
                    this.medicamento = data;
                },
                error: (err) => {
                    console.error('Error al cargar el medicamento', err);
                    this.router.navigate(['/dashboard/medicamento']);
                }
            });
        }
    }

    actualizar(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.medicamentoService.update(id, this.medicamento).subscribe({
            next: () => {
                this.router.navigate(['/dashboard/medicamento']);
            },
            error: (err) => {
                console.error('Error al actualizar el medicamento', err);
            }
        });
    }
}
