import { DetalleCompra } from "./detalle-compra.interface";
import { Proveedor } from "./proveedor.interface";

export interface Compra {
  id?: number;
  monto?: number;
  fecha?: string;
  detalles?: DetalleCompra[];
  proveedorId?: number;
  proveedor?: Proveedor;
}