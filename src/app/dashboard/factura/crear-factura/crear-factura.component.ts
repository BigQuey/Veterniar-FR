import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dueno } from '../../../models/dueno.model';
import { FacturaService } from '../../../services/factura.service';
import { DuenoService } from '../../../services/dueno.service';
import { ServicioService } from '../../../services/servicio.service';
import { Router, RouterModule } from '@angular/router';
import { FacturaRequest } from '../../../models/factura.model';
import { Servicio } from '../../../models/servicio.model';
import { extraerMensajeError } from '../../../utils/error.util';

interface DetalleCreacion {
    servicio: Servicio;
    cantidad: number;
}

@Component({
    selector: 'app-crear-factura',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './crear-factura.component.html',
    styleUrl: './crear-factura.component.css',
})
export class CrearFacturaComponent implements OnInit {
    factura = {
        fecha: this.fechaHoy(),
        dueno: undefined as Dueno | undefined,
        detalles: [] as DetalleCreacion[],
        total: 0,
        metodoPago: 'EFECTIVO' as 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA',
        estadoPago: 'PAGADO' as 'PAGADO' | 'PENDIENTE',
    };

    duenosDisponibles: Dueno[] = [];
    serviciosDisponibles: Servicio[] = [];
    error = '';
    guardando = false;

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

    fechaHoy(): string {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
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

    agregarServicio(servicio: Servicio) {
        const existente = this.factura.detalles.find(d => d.servicio.id === servicio.id);
        if (existente) {
            existente.cantidad += 1;
        } else {
            this.factura.detalles.push({ servicio, cantidad: 1 });
        }
        this.calcularTotal();
    }

    estaAgregado(servicio: Servicio): boolean {
        return this.factura.detalles.some(d => d.servicio.id === servicio.id);
    }

    incrementar(index: number) {
        this.factura.detalles[index].cantidad += 1;
        this.calcularTotal();
    }

    decrementar(index: number) {
        const detalle = this.factura.detalles[index];
        if (detalle.cantidad <= 1) return;
        detalle.cantidad -= 1;
        this.calcularTotal();
    }

    eliminarDetalle(index: number) {
        this.factura.detalles.splice(index, 1);
        this.calcularTotal();
    }

    subtotalDetalle(detalle: DetalleCreacion): number {
        return (detalle.servicio.precio ?? 0) * (detalle.cantidad ?? 0);
    }

    calcularTotal() {
        this.factura.total = this.factura.detalles.reduce((acc, d) => acc + this.subtotalDetalle(d), 0);
    }

    guardarFactura() {
        this.error = '';
        if (!this.factura.dueno?.id) {
            this.error = 'Selecciona el cliente (dueño) de la factura';
            return;
        }
        if (this.factura.detalles.length === 0) {
            this.error = 'Agrega al menos un servicio a la factura';
            return;
        }

        this.guardando = true;
        const request: FacturaRequest = {
            fecha: this.factura.fecha,
            duenoId: this.factura.dueno.id,
            metodoPago: this.factura.metodoPago,
            estadoPago: this.factura.estadoPago,
            detalles: this.factura.detalles.map(d => ({
                servicioId: d.servicio.id!,
                cantidad: d.cantidad,
            })),
        };

        this.facturaService.create(request).subscribe({
            next: () => {
                this.router.navigate(['/dashboard/factura']);
            },
            error: (err) => {
                this.guardando = false;
                this.error = extraerMensajeError(err, 'No se pudo generar la factura');
            }
        });
    }
}
