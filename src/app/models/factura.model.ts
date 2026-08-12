import { DetalleFactura, DetalleFacturaRequest } from "./detalle-factura.model";
import { Dueno } from "./dueno.model";

export interface Factura {
    id?: number;
    fecha?: string;
    dueno?: Dueno;
    detalles?: DetalleFactura[];
    total?: number;
    metodoPago?: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
    estadoPago?: 'PAGADO' | 'PENDIENTE';
    cita?: { id: number; fecha: string; hora: string; estado: string };
}

export interface FacturaRequest {
    id?: number;
    fecha: string;
    duenoId: number;
    citaId?: number;
    metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
    estadoPago: 'PAGADO' | 'PENDIENTE';
    detalles: DetalleFacturaRequest[];
}
