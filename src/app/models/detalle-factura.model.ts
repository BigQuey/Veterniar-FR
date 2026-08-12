import { Servicio } from './servicio.model';

export interface DetalleFactura {
    id?: number;
    servicio?: Servicio;
    precioUnitario?: number;
    cantidad?: number;
    subtotal?: number;
}

export interface DetalleFacturaRequest {
    servicioId: number;
    cantidad: number;
}
