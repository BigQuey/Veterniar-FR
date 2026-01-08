import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HistorialClinicoService } from '../../services/historial-clinico.service';
import { HistorialClinico } from '../../models/historial-clinico.model';

@Component({
    selector: 'app-historial-clinico',
    imports: [CommonModule, RouterModule],
    templateUrl: './historial-clinico.component.html',
    styleUrl: './historial-clinico.component.css'
})
export class HistorialClinicoComponent implements OnInit {
    historiales: HistorialClinico[] = [];

    constructor(private historialService: HistorialClinicoService) { }

    ngOnInit(): void {
        this.cargarHistoriales();
    }

    cargarHistoriales(): void {
        this.historialService.getAll().subscribe((data) => {
            this.historiales = data;
        });
    }

    eliminarHistorial(id: number | undefined): void {
        if (id && confirm('¿Estás seguro de eliminar este registro del historial?')) {
            this.historialService.delete(id).subscribe(() => {
                this.cargarHistoriales();
            });
        }
    }
}
