import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';
import { extraerMensajeError } from '../../utils/error.util';

@Component({
    selector: 'app-cita',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './cita.component.html',
    styleUrl: './cita.component.css'
})
export class CitaComponent implements OnInit {
    citas: Cita[] = [];
    filtroFecha = '';
    soloPendientes = false;
    error = '';
    mensajeExito = '';

    constructor(private citaService: CitaService) { }

    ngOnInit(): void {
        this.cargarCitas();
    }

    get rol(): string | null {
        return localStorage.getItem('rol');
    }

    get puedeCambiarEstado(): boolean {
        return this.rol === 'ADMIN' || this.rol === 'VETERINARIO';
    }

    get puedeEliminar(): boolean {
        return this.rol === 'ADMIN';
    }

    cargarCitas(): void {
        let obs;
        if (this.soloPendientes) {
            obs = this.citaService.getPendientes();
        } else if (this.filtroFecha) {
            obs = this.citaService.getPorFecha(this.filtroFecha);
        } else {
            obs = this.citaService.getAll();
        }

        obs.subscribe({
            next: (data) => {
                this.citas = data;
            },
            error: (err) => {
                this.error = extraerMensajeError(err, 'No se pudieron cargar las citas');
            }
        });
    }

    onFiltroChange(): void {
        this.cargarCitas();
    }

    cambiarEstado(cita: Cita, estado: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA'): void {
        if (!cita.id) return;

        this.citaService.cambiarEstado(cita.id, estado).subscribe({
            next: () => {
                this.cargarCitas();
                this.mostrarExito('Estado de la cita actualizado');
            },
            error: (err) => {
                this.error = extraerMensajeError(err, 'No se pudo cambiar el estado de la cita');
            }
        });
    }

    cancelar(cita: Cita): void {
        if (!cita.id) return;

        if (confirm('¿Estás seguro de cancelar esta cita?')) {
            this.citaService.cancelar(cita.id).subscribe({
                next: () => {
                    this.cargarCitas();
                    this.mostrarExito('Cita cancelada correctamente');
                },
                error: (err) => {
                    this.error = extraerMensajeError(err, 'No se pudo cancelar la cita');
                }
            });
        }
    }

    eliminarCita(id: number | undefined): void {
        if (id && confirm('¿Estás seguro de eliminar esta cita?')) {
            this.citaService.delete(id).subscribe({
                next: () => {
                    this.cargarCitas();
                    this.mostrarExito('Cita eliminada');
                },
                error: (err) => {
                    this.error = extraerMensajeError(err, 'No se pudo eliminar la cita');
                }
            });
        }
    }

    private mostrarExito(msg: string): void {
        this.mensajeExito = msg;
        this.error = '';
        setTimeout(() => (this.mensajeExito = ''), 2000);
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
