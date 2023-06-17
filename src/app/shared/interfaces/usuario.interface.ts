import { Rol } from "./rol.interface";

export interface Usuario {
  id?: number;
  nombres?: string;
  apellidos?: string;
  dni?: number;
  email?: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  estado?: number;
  rolId?: number;
  roles?: Rol[];
}