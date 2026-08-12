import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../services/factura.service';
import { DuenoService } from '../../../services/dueno.service';
import { ServicioService } from '../../../services/servicio.service';
import { Factura, FacturaRequest } from '../../../models/factura.model';
import { Dueno } from '../../../models/dueno.model';
import { Servicio } from '../../../models/servicio.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { extraerMensajeError } from '../../../utils/error.util';

interface DetalleEdicion {
    servicio: Servicio;
    cantidad: number;
}

@Component({
    selector: 'app-editar-factura',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './editar-factura.component.html',
    styleUrl: './editar-factura.component.css'
})
export class EditarFacturaComponent implements OnInit {
    factura?: Factura;
    detalles: DetalleEdicion[] = [];
    duenosDisponibles: Dueno[] = [];
    serviciosDisponibles: Servicio[] = [];
    duenoId?: number;
    total = 0;
    error = '';
    guardando = false;

    private facturaId: number;

    constructor(
        private facturaService: FacturaService,
        private duenoService: DuenoService,
        private servicioService: ServicioService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.facturaId = Number(this.route.snapshot.paramMap.get('id'));
    }

    ngOnInit(): void {
        this.duenoService.getAll().subscribe({
            next: (duenos: Dueno[]) => this.duenosDisponibles = duenos,
            error: (err) => console.error('Error cargando dueños', err)
        });

        this.servicioService.getAll().subscribe({
            next: (servicios: Servicio[]) => {
                this.serviciosDisponibles = servicios;
                this.obtenerFactura();
            },
            error: (err) => console.error('Error cargando servicios', err)
        });
    }

    obtenerFactura() {
        if (!this.facturaId) return;
        this.facturaService.getOne(this.facturaId).subscribe({
            next: (factura: Factura) => {
                this.factura = factura;
                this.duenoId = factura.dueno?.id;
                this.detalles = (factura.detalles ?? []).map((d) => ({
                    servicio: d.servicio ?? {} as Servicio,
                    cantidad: d.cantidad ?? 1
                }));
                this.calcularTotal();
            },
            error: (err) => {
                this.error = extraerMensajeError(err, 'No se pudo cargar la factura');
            }
        });
    }

    agregarServicio(servicio: Servicio) {
        const existente = this.detalles.find(d => d.servicio.id === servicio.id);
        if (existente) {
            existente.cantidad += 1;
        } else {
            this.detalles.push({ servicio, cantidad: 1 });
        }
        this.calcularTotal();
    }

    estaAgregado(servicio: Servicio): boolean {
        return this.detalles.some(d => d.servicio.id === servicio.id);
    }

    incrementar(index: number) {
        this.detalles[index].cantidad += 1;
        this.calcularTotal();
    }

    decrementar(index: number) {
        const detalle = this.detalles[index];
        if (detalle.cantidad <= 1) return;
        detalle.cantidad -= 1;
        this.calcularTotal();
    }

    eliminarDetalle(index: number) {
        this.detalles.splice(index, 1);
        this.calcularTotal();
    }

    subtotalDetalle(detalle: DetalleEdicion): number {
        return (detalle.servicio.precio ?? 0) * (detalle.cantidad ?? 0);
    }

    calcularTotal() {
        this.total = this.detalles.reduce((acc, d) => acc + this.subtotalDetalle(d), 0);
    }

    guardarFactura() {
        if (!this.duenoId) {
            this.error = 'Selecciona el cliente (dueño) de la factura';
            return;
        }
        if (this.detalles.length === 0) {
            this.error = 'Agrega al menos un servicio a la factura';
            return;
        }

        this.guardando = true;
        const request: FacturaRequest = {
            id: this.factura?.id,
            fecha: this.factura?.fecha || '',
            duenoId: this.duenoId,
            metodoPago: this.factura?.metodoPago ?? 'EFECTIVO',
            estadoPago: this.factura?.estadoPago ?? 'PENDIENTE',
            detalles: this.detalles.map(d => ({
                servicioId: d.servicio.id!,
                cantidad: d.cantidad,
            })),
        };

        this.facturaService.update(request).subscribe({
            next: () => {
                this.router.navigate(['/dashboard/factura']);
            },
            error: (err) => {
                this.guardando = false;
                this.error = extraerMensajeError(err, 'No se pudo actualizar la factura');
            }
        });
    }
}
