import { Component, OnInit } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import icGroup from '@iconify/icons-ic/twotone-group';
import icShoppingCart from '@iconify/icons-ic/twotone-shopping-cart';
import { ProductoService } from 'src/app/core/services/producto.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UsuarioJWT } from 'src/app/shared/interfaces/usuario-jwt.interface';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class DashboardComponent implements OnInit {

  usuarioJWT: UsuarioJWT;
  rol: string;

  numProductos: number;
  numClientes:number;

  icCheckCircle = icCheckCircle;
  icGroup = icGroup;
  icShoppingCart = icShoppingCart;

  constructor(
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.productoService.find()
      .subscribe(response => {
        this.numProductos = response.total;
      });

    this.clienteService.find()
      .subscribe(response => {
        this.numClientes = response.total;
      });

    this.usuarioJWT = this.tokenService.getUsuarioJWT();
    this.rol = this.usuarioJWT.roles[0].nombre;
  }

  public mostrarOpcionInventario(): boolean {
    return this.rol === 'admin' || this.rol === 'inventario';
  }

  public mostrarOpcionUsuarios(): boolean {
    return this.rol === 'admin' || this.rol === 'venta';
  }

  public mostrarOpcionPedidos(): boolean {
    return this.rol === 'admin' || this.rol === 'venta';
  }
}
