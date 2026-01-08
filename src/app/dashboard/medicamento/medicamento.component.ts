import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MedicamentoService } from '../../services/medicamento.service';
import { Medicamento } from '../../models/medicamento.model';

@Component({
    selector: 'app-medicamento',
    imports: [CommonModule, RouterModule],
    templateUrl: './medicamento.component.html',
    styleUrl: './medicamento.component.css'
})
export class MedicamentoComponent implements OnInit {
    medicamentos: Medicamento[] = [];

    constructor(private medicamentoService: MedicamentoService) { }

    ngOnInit(): void {
        this.cargarMedicamentos();
    }

    cargarMedicamentos(): void {
        this.medicamentoService.getAll().subscribe((data) => {
            this.medicamentos = data;
        });
    }

    eliminarMedicamento(id: number | undefined): void {
        if (id && confirm('¿Estás seguro de eliminar este medicamento?')) {
            this.medicamentoService.delete(id).subscribe(() => {
                this.cargarMedicamentos();
            });
        }
    }

    getStockClass(stock: number | undefined): string {
        if (!stock || stock === 0) return 'text-red-600 bg-red-50';
        if (stock < 10) return 'text-amber-600 bg-amber-50';
        return 'text-emerald-600 bg-emerald-50';
    }
}
