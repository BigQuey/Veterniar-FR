import { Servicio } from "./servicio.model";

export interface DetalleFactura {
    id?: number;
    cantidad?: number;
    subtotal?: number;
    servicio?: Servicio | null;
}