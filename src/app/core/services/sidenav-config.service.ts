import { Injectable } from '@angular/core';
import { NavigationService } from 'src/@vex/services/navigation.service';
import { TokenService } from './token.service';

import icLayers from '@iconify/icons-ic/twotone-layers';
import icPeople from '@iconify/icons-ic/people';
import icInsertChart from '@iconify/icons-ic/insert-chart';
import icAssignment from '@iconify/icons-ic/assignment';


@Injectable({
  providedIn: 'root'
})
export class SidenavConfigService {

  constructor(
    private navigationService: NavigationService,
    private tokenService: TokenService
  ) { }

  public cargarSidenavItems(): void {
    const usuarioJWT = this.tokenService.getUsuarioJWT();
    const rol = usuarioJWT.roles[0].nombre;

    switch (rol) {
      case 'admin':
        this.navigationService.items = [
          {
            type: 'link',
            label: 'Dashboard',
            route: '/admin/dashboard',
            icon: icInsertChart
          },
          {
            type: 'dropdown',
            label: 'Inventario',
            icon: icLayers,
            children: [
              {
                type: 'link',
                label: 'Categorías',
                route: '/admin/inventario/categorias'
              },
              {
                type: 'link',
                label: 'Compras',
                route: '/admin/inventario/compras'
              },
              {
                type: 'link',
                label: 'Productos',
                route: '/admin/inventario/productos'
              },
              {
                type: 'link',
                label: 'Proveedores',
                route: '/admin/inventario/proveedores'
              }
            ]
          },
          {
            type: 'dropdown',
            label: 'Usuarios',
            icon: icPeople,
            children: [
              {
                type: 'link',
                label: 'Clientes',
                route: '/admin/usuarios/clientes'
              },
              {
                type: 'link',
                label: 'Empleados',
                route: '/admin/usuarios/empleados'
              }
            ]
          },
          {
            type: 'link',
            label: 'Pedidos',
            route: '/admin/pedidos',
            icon: icAssignment
          },
        ];
        break;
      case 'venta': 
        this.navigationService.items = [
          {
            type: 'link',
            label: 'Dashboard',
            route: '/admin/dashboard',
            icon: icInsertChart
          },
          {
            type: 'dropdown',
            label: 'Usuarios',
            icon: icPeople,
            children: [
              {
                type: 'link',
                label: 'Clientes',
                route: '/admin/usuarios/clientes'
              }
            ]
          },
          {
            type: 'link',
            label: 'Pedidos',
            route: '/admin/pedidos',
            icon: icAssignment
          },
        ];
        break;
      case 'inventario':
        this.navigationService.items = [
          {
            type: 'link',
            label: 'Dashboard',
            route: '/admin/dashboard',
            icon: icInsertChart
          },
          {
            type: 'dropdown',
            label: 'Inventario',
            icon: icLayers,
            children: [
              {
                type: 'link',
                label: 'Categorías',
                route: '/admin/inventario/categorias'
              },
              {
                type: 'link',
                label: 'Compras',
                route: '/admin/inventario/compras'
              },
              {
                type: 'link',
                label: 'Productos',
                route: '/admin/inventario/productos'
              },
              {
                type: 'link',
                label: 'Proveedores',
                route: '/admin/inventario/proveedores'
              }
            ]
          }
        ];
        break;
    }
  }
}
