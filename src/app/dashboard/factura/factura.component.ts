import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Factura } from '../../models/factura.model';
import { FacturaService } from '../../services/factura.service';
import { FormsModule } from '@angular/forms';
import { extraerMensajeError } from '../../utils/error.util';

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
  error: string = '';
  // Para la búsqueda
  term: string = '';
  constructor(private facturaService: FacturaService) { }

  ngOnInit(): void {
    this.obtenerFacturas();
  }

  obtenerFacturas() {
    this.facturaService.getAll().subscribe({
      next: (data: Factura[]) => {
        this.facturas = data;
        this.facturasOriginal = data;
      },
      error: (error) => {
        this.error = extraerMensajeError(error, 'No se pudieron cargar las facturas');
      }
    });
  }

  getEstadoClass(estado: string | undefined): string {
    switch (estado) {
      case 'PAGADO': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'PENDIENTE': return 'text-amber-700 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  }

  getMetodoIcon(metodo: string | undefined): string {
    switch (metodo) {
      case 'EFECTIVO': return '💵';
      case 'TARJETA': return '💳';
      case 'TRANSFERENCIA': return '🏦';
      default: return '📄';
    }
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
          this.error = extraerMensajeError(error, 'No se pudo eliminar la factura');
        },
      });
    }
  }
  buscar() {
    const lower = this.term.toLowerCase();
    if (!lower) {
      this.facturas = [...this.facturasOriginal];
      return;
    }
    this.facturas = this.facturasOriginal.filter(f =>
      f.id?.toString().includes(this.term) ||
      f.dueno?.nombre?.toLowerCase().includes(lower)
    );
  }

  actualizarEstado(factura: Factura): void {
    if (factura.id === undefined) return;

    if (confirm('¿Quieres actualizar el estado de pago?')) {
      const nuevoEstado: 'PAGADO' | 'PENDIENTE' = factura.estadoPago === 'PAGADO' ? 'PENDIENTE' : 'PAGADO';

      this.facturaService.cambiarEstado(factura.id, nuevoEstado).subscribe({
        next: () => {
          this.obtenerFacturas();
          this.mensajeExito = `El estado se ha actualizado a ${nuevoEstado} correctamente.`;
          setTimeout(() => (this.mensajeExito = ''), 1500);
        },
        error: (error) => {
          this.error = extraerMensajeError(error, 'No se pudo actualizar el estado de la factura');
        },
      });
    }
  }

}
