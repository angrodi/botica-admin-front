import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPedidoComponent } from './crear-pedido/crear-pedido.component';
import { TablaPedidoComponent } from './tabla-pedido/tabla-pedido.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TablaPedidoComponent
      },
      {
        path: 'crear',
        component: CrearPedidoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
