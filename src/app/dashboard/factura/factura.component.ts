import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Factura } from '../../models/factura.model';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-factura',
  imports: [CommonModule, RouterModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent {
  facturas: Factura[] = [];
  mensajeExito: string = '';

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.obtenerFacturas();
  }

  obtenerFacturas() {
    this.facturaService.getAll().subscribe({
      next: (facturas: Factura[]) => {
        this.facturas = facturas;
      },
      error: (error) => {
        console.error('Error al obtener las facturas:', error);
      },
    });
  }

  eliminar(id: number | undefined): void {
    if (id === undefined) return;

    if (confirm('¿Seguro que deseas eliminar esta factura?')) {
      this.facturaService.delete(id).subscribe({
        next: () => {
          this.obtenerFacturas();
          this.mensajeExito = 'Factura eliminada correctamente.';
          setTimeout(() => (this.mensajeExito = ''), 1500);
        },
        error: (error) => {
          console.error('Error al eliminar la factura:', error);
        },
      });
    }
  }
}
