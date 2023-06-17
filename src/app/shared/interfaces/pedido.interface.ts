import { Cliente } from "./cliente.interface";
import { DetallePedido } from "./detalle-pedido.interface";
import { Usuario } from "./usuario.interface";

export interface Pedido {
  id?: number;
  direccion?: string;
  monto?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  metodoPago?: string;
  estado?: string;
  detalles?: DetallePedido[];
  clienteId?: number;
  empleadoId?: number;
  cliente?: Cliente;
  empleado?: Usuario;
}