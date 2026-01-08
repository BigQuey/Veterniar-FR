import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';

@Component({
    selector: 'app-cita',
    imports: [CommonModule, RouterModule],
    templateUrl: './cita.component.html',
    styleUrl: './cita.component.css'
})
export class CitaComponent implements OnInit {
    citas: Cita[] = [];

    constructor(private citaService: CitaService) { }

    ngOnInit(): void {
        this.cargarCitas();
    }

    cargarCitas(): void {
        this.citaService.getAll().subscribe((data) => {
            this.citas = data;
        });
    }

    eliminarCita(id: number | undefined): void {
        if (id && confirm('¿Estás seguro de eliminar esta cita?')) {
            this.citaService.delete(id).subscribe(() => {
                this.cargarCitas();
            });
        }
    }

    getEstadoClass(estado: string | undefined): string {
        switch (estado) {
            case 'PROGRAMADA': return 'bg-blue-100 text-blue-700';
            case 'COMPLETADA': return 'bg-green-100 text-green-700';
            case 'CANCELADA': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }
}
