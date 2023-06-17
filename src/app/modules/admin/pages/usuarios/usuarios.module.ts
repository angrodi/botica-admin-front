import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { CrearEditarEmpleadoComponent } from './empleados/crear-editar-empleado/crear-editar-empleado.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconModule } from '@visurel/iconify-angular';

import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CrearEditarClienteComponent } from './clientes/crear-editar-cliente/crear-editar-cliente.component';
import { CambiarPasswordComponent } from './empleados/cambiar-password/cambiar-password.component';
import { TablaClienteComponent } from './clientes/tabla-cliente/tabla-cliente.component';
import { TablaEmpleadoComponent } from './empleados/tabla-empleado/tabla-empleado.component';



@NgModule({
  declarations: [
    TablaEmpleadoComponent,
    TablaClienteComponent,
    CrearEditarEmpleadoComponent,
    CrearEditarClienteComponent,
    CambiarPasswordComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,

    PageLayoutModule,
    BreadcrumbsModule,
    IconModule,

    MaterialModule
  ]
})
export class UsuariosModule { }
