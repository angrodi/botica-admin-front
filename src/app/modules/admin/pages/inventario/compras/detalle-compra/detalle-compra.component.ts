import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import { Compra } from 'src/app/shared/interfaces/compra.interface';

@Component({
  selector: 'vex-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.scss']
})
export class DetalleCompraComponent implements OnInit {

  compra: Compra;

  // Iconos
  icClose = icClose;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any
  ) { }

  ngOnInit(): void {
    this.compra = this.defaults.compra;
  }

}
