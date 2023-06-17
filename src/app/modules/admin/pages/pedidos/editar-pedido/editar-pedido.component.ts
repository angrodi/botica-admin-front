import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';
import { PedidoService } from 'src/app/core/services/pedido.service';
import { Pedido } from '../../../../../shared/interfaces/pedido.interface';

@Component({
  selector: 'vex-editar-pedido',
  templateUrl: './editar-pedido.component.html',
  styleUrls: ['./editar-pedido.component.scss']
})
export class EditarPedidoComponent implements OnInit {

  form: FormGroup;
  pedido: Pedido;

  // Iconos
  icClose = icClose;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<EditarPedidoComponent>,
    private fb: FormBuilder,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    if (this.defaults.pedido) {
      this.pedido = this.defaults.pedido;
    } else {
      this.pedido = {} as Pedido;
    }

    this.form = this.fb.group({
      estado: [this.pedido.estado, [ Validators.required ]]
    });
  }

  actualizarPedido(): void {
    const pedido: Pedido = this.form.value;
    pedido.id = this.defaults.pedido.id;

    // Ejecutar la actualización
    this.pedidoService.patch(pedido.id, pedido)
      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.dialogRef.close(error);
      });
  }


}
