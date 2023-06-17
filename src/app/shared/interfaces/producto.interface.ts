import { Categoria } from "./categoria.interface";

export interface Producto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  imagen?: string | File;
  precio?: number;
  stock?: number;
  estado?: number;
  categoriaId?: number;
  categoria?: Categoria;
}