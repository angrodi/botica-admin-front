import { Producto } from "./producto.interface";

export interface DetalleCompra {
  id?: number;
  cantidad?: number;
  precio?: number;
  productoId?: number;
  compraId?: number;
  producto?: Producto;
}