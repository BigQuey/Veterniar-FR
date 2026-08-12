import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../services/cita.service';
import { MascotaService } from '../../../services/mascota.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CitaRequest } from '../../../models/cita.model';
import { Mascota } from '../../../models/mascota.models';
import { Usuario } from '../../../models/usuario.model';
import { extraerMensajeError } from '../../../utils/error.util';

@Component({
    selector: 'app-crear-cita',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './crear-cita.component.html',
    styleUrl: './crear-cita.component.css'
})
export class CrearCitaComponent implements OnInit {
    cita: CitaRequest = {
        fecha: '',
        hora: '',
        mascotaId: undefined as unknown as number,
        veterinarioId: undefined as unknown as number,
        motivo: ''
    };

    mascotas: Mascota[] = [];
    veterinarios: Usuario[] = [];
    error = '';

    constructor(
        private citaService: CitaService,
        private mascotaService: MascotaService,
        private usuarioService: UsuarioService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.mascotaService.getAll().subscribe((data: any) => this.mascotas = data);
        this.usuarioService.getAllVeterinarios().subscribe((data: any) => this.veterinarios = data);
    }

    guardar(): void {
        if (!this.cita.mascotaId || !this.cita.veterinarioId || !this.cita.fecha || !this.cita.hora) {
            this.error = 'Por favor completa todos los campos obligatorios';
            return;
        }

        const request: CitaRequest = {
            ...this.cita,
            hora: this.cita.hora.length === 5 ? `${this.cita.hora}:00` : this.cita.hora
        };

        this.citaService.create(request).subscribe({
            next: () => {
                this.router.navigate(['/dashboard/cita']);
            },
            error: (err) => {
                this.error = extraerMensajeError(err, 'No se pudo programar la cita');
            }
        });
    }
}
