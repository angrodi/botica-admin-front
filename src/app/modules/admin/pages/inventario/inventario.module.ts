import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { TablaCategoriaComponent } from './categorias/tabla-categoria/tabla-categoria.component';
import { CrearEditarCategoriaComponent } from './categorias/crear-editar-categoria/crear-editar-categoria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { IconModule } from '@visurel/iconify-angular';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { TablaProductoComponent } from './productos/tabla-producto/tabla-producto.component';
import { CrearEditarProductoComponent } from './productos/crear-editar-producto/crear-editar-producto.component';

import { CrearEditarProveedorComponent } from './proveedores/crear-editar-proveedor/crear-editar-proveedor.component';
import { TablaProveedorComponent } from './proveedores/tabla-proveedor/tabla-proveedor.component';
import { TablaCompraComponent } from './compras/tabla-compra/tabla-compra.component';
import { DetalleCompraComponent } from './compras/detalle-compra/detalle-compra.component';
import { CrearCompraComponent } from './compras/crear-compra/crear-compra.component';

@NgModule({
  declarations: [
    TablaCategoriaComponent,
    CrearEditarCategoriaComponent,
    TablaProductoComponent,
    CrearEditarProductoComponent,
    CrearEditarProveedorComponent,
    TablaProveedorComponent,
    TablaCompraComponent,
    DetalleCompraComponent,
    CrearCompraComponent,
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,

    PageLayoutModule,
    BreadcrumbsModule,
    IconModule,

    MaterialModule
  ]
})
export class InventarioModule { }
