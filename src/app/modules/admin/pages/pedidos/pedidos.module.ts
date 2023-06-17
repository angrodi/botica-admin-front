import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { TablaPedidoComponent } from './tabla-pedido/tabla-pedido.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { IconModule } from '@visurel/iconify-angular';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { EditarPedidoComponent } from './editar-pedido/editar-pedido.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { CrearPedidoComponent } from './crear-pedido/crear-pedido.component';


@NgModule({
  declarations: [
    TablaPedidoComponent,
    EditarPedidoComponent,
    DetallePedidoComponent,
    CrearPedidoComponent
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,

    PageLayoutModule,
    BreadcrumbsModule,
    IconModule,

    MaterialModule
  ]
})
export class PedidosModule { }
