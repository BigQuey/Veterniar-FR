import { DetalleFactura } from "./detalle-factura.model";
import { Dueno } from "./dueno.model";

export interface Factura {
    id?: number;
    fecha?: string;
    dueno?: Dueno;
    detalles?: DetalleFactura[];
    total?: number;
}