import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import { Pedido } from '../../../../../shared/interfaces/pedido.interface';

@Component({
  selector: 'vex-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss']
})
export class DetallePedidoComponent implements OnInit {

  pedido: Pedido;

  // Iconos
  icClose = icClose;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any
  ) { }

  ngOnInit(): void {
    this.pedido = this.defaults.pedido;
  }

}
