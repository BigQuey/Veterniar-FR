import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Factura } from '../../models/factura.model';
import { FacturaService } from '../../services/factura.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-factura',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent {
  facturasOriginal: Factura[] = [];
  facturas: Factura[] = [];
  mensajeExito: string = '';
  // Para la búsqueda
  term: string = '';
  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.obtenerFacturas();
  }

  obtenerFacturas() {
    this.facturaService.getAll().subscribe({
      next: (facturas: Factura[]) => {
        this.facturas = facturas;
        this.facturasOriginal = facturas;
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
  buscar(){
    const lower = this.term.toLowerCase();
    if(!lower){
      this.facturas = [...this.facturasOriginal];
      return;
    }
    this.facturas = this.facturasOriginal.filter(f =>
    f.id?.toString().includes(this.term) ||
    f.dueno?.nombre?.toLowerCase().includes(lower)
  );

  console.log('Resultados de la búsqueda:', this.facturas);
  }
}
