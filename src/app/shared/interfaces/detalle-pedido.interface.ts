import { Producto } from "./producto.interface";

export interface DetallePedido {
  id?: number;
  cantidad?: number;
  productoId?: number;
  pedidoId?: number;
  producto?: Producto
}