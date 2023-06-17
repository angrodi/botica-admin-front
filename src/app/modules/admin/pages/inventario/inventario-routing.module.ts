import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaCategoriaComponent } from './categorias/tabla-categoria/tabla-categoria.component';
import { CrearCompraComponent } from './compras/crear-compra/crear-compra.component';
import { TablaCompraComponent } from './compras/tabla-compra/tabla-compra.component';
import { TablaProductoComponent } from './productos/tabla-producto/tabla-producto.component';
import { TablaProveedorComponent } from './proveedores/tabla-proveedor/tabla-proveedor.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'categorias',
        component: TablaCategoriaComponent
      },
      {
        path: 'productos',
        component: TablaProductoComponent
      },
      {
        path: 'proveedores',
        component: TablaProveedorComponent
      },
      {
        path: 'compras',
        children: [
          {
            path: '',
            component: TablaCompraComponent
          },
          {
            path: 'crear',
            component: CrearCompraComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
