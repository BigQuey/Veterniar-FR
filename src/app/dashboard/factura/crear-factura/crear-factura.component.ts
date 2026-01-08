import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dueno } from '../../../models/dueno.model';
import { FacturaService } from '../../../services/factura.service';
import { DuenoService } from '../../../services/dueno.service';
import { ServicioService } from '../../../services/servicio.service';
import { Router, RouterModule } from '@angular/router';
import { Factura } from '../../../models/factura.model';
import { Servicio } from '../../../models/servicio.model';

@Component({
  selector: 'app-crear-factura',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-factura.component.html',
  styleUrl: './crear-factura.component.css',
})
export class CrearFacturaComponent {
  factura = {
    fecha: '',
    dueno: undefined,
    detalles: [] as {
      servicio: Servicio | null;
      cantidad: number;
      subtotal: number;
    }[],
    total: 0,
    metodoPago: 'EFECTIVO',
    estadoPago: 'PENDIENTE',
  };

  duenosDisponibles: Dueno[] = [];
  serviciosDisponibles: Servicio[] = [];

  constructor(
    private facturaService: FacturaService,
    private duenoService: DuenoService,
    private servicioService: ServicioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDuenos();
    this.cargarServicios();
  }

  cargarDuenos() {
    this.duenoService.getAll().subscribe((duenos: any) => {
      this.duenosDisponibles = duenos;
    });
  }

  cargarServicios() {
    this.servicioService.getAll().subscribe((servicios: any) => {
      this.serviciosDisponibles = servicios;
    });
  }

  agregarDetalle() {
    this.factura.detalles?.push({
      servicio: null,
      cantidad: 1,
      subtotal: 0,
    });
  }

  eliminarDetalle(index: number) {
    this.factura.detalles.splice(index, 1);
    this.factura.total = this.factura.detalles.reduce(
      (acc, d) => acc + (d.subtotal || 0),
      0
    );
  }

  calcularSubtotal(index: number) {


    const detalle = this.factura.detalles?.[index];
    if (detalle?.servicio?.precio && detalle?.cantidad) {
      detalle.subtotal = detalle.servicio.precio * detalle.cantidad;
    } else {
      detalle.subtotal = 0;
    }
    this.calcularTotal();
  }

  calcularTotal() {
    this.factura.total = this.factura.detalles.reduce(
      (acc, d) => acc + (d.subtotal || 0),
      0
    );
  }

  guardarFactura() {
    if (!this.factura.dueno || !this.factura.detalles) return;

    const facturaAEnviar: Factura = {
      fecha: this.factura.fecha,
      dueno: this.factura.dueno,
      detalles: [],
      total: this.factura.detalles.reduce(
        (acc, d) => acc + (d.subtotal || 0),
        0
      ),
      metodoPago: this.factura.metodoPago as any,
      estadoPago: this.factura.estadoPago as any,
    };


    facturaAEnviar.detalles = this.factura.detalles.map((d) => ({
      servicio: d.servicio!,
      cantidad: d.cantidad,
      subtotal: d.subtotal,
      // factura: facturaAEnviar,
    }));
    this.facturaService.create(facturaAEnviar).subscribe(() => {
      this.router.navigate(['/dashboard/factura']);
    });
  }
}
