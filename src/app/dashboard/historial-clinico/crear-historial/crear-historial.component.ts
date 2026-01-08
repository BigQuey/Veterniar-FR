import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { MascotaService } from '../../../services/mascota.service';
import { UsuarioService } from '../../../services/usuario.service';
import { HistorialClinico } from '../../../models/historial-clinico.model';
import { Mascota } from '../../../models/mascota.models';
import { Usuario } from '../../../models/usuario.model';

@Component({
    selector: 'app-crear-historial',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './crear-historial.component.html',
    styleUrl: './crear-historial.component.css'
})
export class CrearHistorialComponent implements OnInit {
    historial: HistorialClinico = {
        fecha: new Date().toISOString().split('T')[0],
        mascota: { id: undefined },
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        veterinario: { id: undefined }
    };

    mascotas: Mascota[] = [];
    veterinarios: Usuario[] = [];

    constructor(
        private historialService: HistorialClinicoService,
        private mascotaService: MascotaService,
        private usuarioService: UsuarioService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.mascotaService.getAll().subscribe((data: any) => this.mascotas = data);
        this.usuarioService.getAllVeterinarios().subscribe((data: any) => this.veterinarios = data);
    }

    guardar(): void {
        console.log(this.historial);
        this.historialService.create(this.historial).subscribe(() => {
            this.router.navigate(['/dashboard/historial-clinico']);
        });
    }
}
