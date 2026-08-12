import { Component } from '@angular/core';
import { DuenoService } from '../../services/dueno.service';
import { Dueno } from '../../models/dueno.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dueno',
  imports: [CommonModule,RouterModule],
  templateUrl: './dueno.component.html',
  styleUrl: './dueno.component.css'
})
export class DuenoComponent {
    duenos: Dueno[] = [];
    mensajeExito: string = '';
    constructor(private duenoService: DuenoService) { }

  get esAdmin(): boolean {
    return localStorage.getItem('rol') === 'ADMIN';
  }
    ngOnInit(): void {
        this.obtenerDuenos();
    }
    obtenerDuenos(){
        this.duenoService.getAll().subscribe({
            next: (duenos: any) => {
                this.duenos = duenos;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
    eliminar(id: number | undefined) {
        if (confirm('¿Seguro que deseas eliminar este dueño?')) {
          this.duenoService.delete(id).subscribe(() => {
            this.obtenerDuenos();
            this.mensajeExito = 'Dueño eliminado correctamente.';
            setTimeout(() => {
                this.mensajeExito = '';
              }, 1500);
          });
        }
    }
}
