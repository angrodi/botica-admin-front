import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        canActivate: [ AdminGuard ],
        data: { rolEsperado: ['admin', 'venta', 'inventario'] },
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: 'inventario',
        canActivate: [ AdminGuard ],
        data: { rolEsperado: ['admin', 'inventario'] },
        loadChildren: () => import('./pages/inventario/inventario.module').then(m => m.InventarioModule)
      },
      {
        path: 'pedidos',
        canActivate: [ AdminGuard ],
        data: { rolEsperado: ['admin', 'venta'] },
        loadChildren: () => import('./pages/pedidos/pedidos.module').then(m => m.PedidosModule)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
