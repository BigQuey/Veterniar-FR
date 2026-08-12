import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { MascotaService } from '../../../services/mascota.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CitaService } from '../../../services/cita.service';
import { HistorialClinicoRequest } from '../../../models/historial-clinico.model';
import { Mascota } from '../../../models/mascota.models';
import { Usuario } from '../../../models/usuario.model';
import { Cita } from '../../../models/cita.model';
import { extraerMensajeError } from '../../../utils/error.util';

@Component({
    selector: 'app-crear-historial',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './crear-historial.component.html',
    styleUrl: './crear-historial.component.css'
})
export class CrearHistorialComponent implements OnInit {
    historial: HistorialClinicoRequest = {
        mascotaId: undefined as unknown as number,
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        veterinarioId: undefined as unknown as number
    };

    mascotas: Mascota[] = [];
    veterinarios: Usuario[] = [];
    citasAtendidas: Cita[] = [];
    citaSeleccionadaId?: number;
    error = '';

    constructor(
        private historialService: HistorialClinicoService,
        private mascotaService: MascotaService,
        private usuarioService: UsuarioService,
        private citaService: CitaService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.mascotaService.getAll().subscribe((data: any) => this.mascotas = data);
        this.usuarioService.getAllVeterinarios().subscribe((data: any) => this.veterinarios = data);
        this.citaService.getAll().subscribe({
            next: (data) => {
                this.citasAtendidas = data.filter(c => c.estado === 'COMPLETADA');
            },
            error: () => { this.citasAtendidas = []; }
        });
    }

    onCitaSeleccionada(): void {
        const cita = this.citasAtendidas.find(c => c.id === this.citaSeleccionadaId);
        if (cita) {
            this.historial.mascotaId = cita.mascota?.id ?? this.historial.mascotaId;
            this.historial.veterinarioId = cita.veterinario?.id ?? this.historial.veterinarioId;
        }
    }

    guardar(): void {
        if (!this.historial.mascotaId || !this.historial.veterinarioId) {
            this.error = 'Selecciona la mascota y el veterinario';
            return;
        }
        if (!this.historial.diagnostico) {
            this.error = 'El diagnóstico es obligatorio';
            return;
        }

        const obs = this.citaSeleccionadaId
            ? this.historialService.createDesdeCita(this.citaSeleccionadaId, this.historial)
            : this.historialService.create(this.historial);

        obs.subscribe({
            next: () => {
                this.router.navigate(['/dashboard/historial-clinico']);
            },
            error: (err) => {
                this.error = extraerMensajeError(err, 'No se pudo registrar el historial clínico');
            }
        });
    }
}
