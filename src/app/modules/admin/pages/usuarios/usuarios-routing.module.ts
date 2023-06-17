import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/core/guards/admin.guard';
import { TablaClienteComponent } from './clientes/tabla-cliente/tabla-cliente.component';
import { TablaEmpleadoComponent } from './empleados/tabla-empleado/tabla-empleado.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'clientes',
        canActivate: [ AdminGuard ],
        data: { rolEsperado: ['admin', 'venta'] },
        component: TablaClienteComponent
      },
      {
        path: 'empleados',
        canActivate: [ AdminGuard ],
        data: { rolEsperado: ['admin'] },
        component: TablaEmpleadoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
