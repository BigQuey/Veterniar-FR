import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicamentoService } from '../../services/medicamento.service';
import { Medicamento } from '../../models/medicamento.model';
import { extraerMensajeError } from '../../utils/error.util';

@Component({
    selector: 'app-medicamento',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './medicamento.component.html',
    styleUrl: './medicamento.component.css'
})
export class MedicamentoComponent implements OnInit {
    medicamentos: Medicamento[] = [];
    term = '';
    error = '';

    constructor(private medicamentoService: MedicamentoService) { }

    ngOnInit(): void {
        this.cargarMedicamentos();
    }

    get esAdmin(): boolean {
        return localStorage.getItem('rol') === 'ADMIN';
    }

    cargarMedicamentos(): void {
        const obs = this.term.trim()
            ? this.medicamentoService.buscarPorNombre(this.term.trim())
            : this.medicamentoService.getAll();

        obs.subscribe({
            next: (data) => {
                this.medicamentos = data;
            },
            error: (err) => {
                this.error = extraerMensajeError(err, 'No se pudieron cargar los medicamentos');
            }
        });
    }

    buscar(): void {
        this.cargarMedicamentos();
    }

    eliminarMedicamento(id: number | undefined): void {
        if (id && confirm('¿Estás seguro de eliminar este medicamento?')) {
            this.medicamentoService.delete(id).subscribe({
                next: () => {
                    this.cargarMedicamentos();
                },
                error: (err) => {
                    this.error = extraerMensajeError(err, 'No se pudo eliminar el medicamento');
                }
            });
        }
    }

    getStockClass(stock: number | undefined): string {
        if (!stock || stock === 0) return 'text-red-600 bg-red-50';
        if (stock < 10) return 'text-amber-600 bg-amber-50';
        return 'text-emerald-600 bg-emerald-50';
    }
}
