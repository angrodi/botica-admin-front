import { Rol } from "./rol.interface";

export interface UsuarioJWT {
  id: number;
  nombre: string;
  roles: Rol[];
}