import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../services/cita.service';
import { MascotaService } from '../../../services/mascota.service';
import { DuenoService } from '../../../services/dueno.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Cita } from '../../../models/cita.model';
import { Mascota } from '../../../models/mascota.models';
import { Dueno } from '../../../models/dueno.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
    selector: 'app-crear-cita',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './crear-cita.component.html',
    styleUrl: './crear-cita.component.css'
})
export class CrearCitaComponent implements OnInit {
    cita: Cita = {
        fecha: '',
        hora: '',
        mascota: { id: undefined },
        dueno: { id: undefined },
        veterinario: { id: undefined },
        motivo: '',
        estado: 'PROGRAMADA'
    };

    mascotas: Mascota[] = [];
    duenos: Dueno[] = [];
    veterinarios: Usuario[] = [];

    constructor(
        private citaService: CitaService,
        private mascotaService: MascotaService,
        private duenoService: DuenoService,
        private usuarioService: UsuarioService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.mascotaService.getAll().subscribe((data: any) => this.mascotas = data);
        this.duenoService.getAll().subscribe((data: any) => this.duenos = data);
        this.usuarioService.getAllVeterinarios().subscribe((data: any) => this.veterinarios = data);
        setTimeout(() => {
            console.log(this.mascotas);
        }, 1000);
    }

    guardar(): void {
        this.citaService.create(this.cita).subscribe(() => {
            this.router.navigate(['/dashboard/cita']);
        });
    }
    onMascotaChange(): void {
        const idMascotaSeleccionada = this.cita.mascota?.id;

        if (idMascotaSeleccionada) {
            const mascotaEncontrada = this.mascotas.find(m => m.id == idMascotaSeleccionada);

            if (mascotaEncontrada && mascotaEncontrada.dueno) {
                this.cita.dueno!.id = mascotaEncontrada.dueno.id;
            }
        }
    }

}
