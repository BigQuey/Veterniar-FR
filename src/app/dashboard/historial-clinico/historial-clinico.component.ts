import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HistorialClinicoService } from '../../services/historial-clinico.service';
import { HistorialClinico } from '../../models/historial-clinico.model';
import { extraerMensajeError } from '../../utils/error.util';

@Component({
    selector: 'app-historial-clinico',
    imports: [CommonModule, RouterModule],
    templateUrl: './historial-clinico.component.html',
    styleUrl: './historial-clinico.component.css'
})
export class HistorialClinicoComponent implements OnInit {
    historiales: HistorialClinico[] = [];
    error = '';

    constructor(private historialService: HistorialClinicoService) { }

    ngOnInit(): void {
        this.cargarHistoriales();
    }

    cargarHistoriales(): void {
        this.historialService.getAll().subscribe({
            next: (data) => {
                this.historiales = data;
            },
            error: (err) => {
                this.error = extraerMensajeError(err, 'No se pudieron cargar los historiales clínicos');
            }
        });
    }
}
