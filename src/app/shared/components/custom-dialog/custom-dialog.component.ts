import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'vex-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class CustomDialogComponent implements OnInit {

  icClose = icClose;
  pregunta: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CustomDialogComponent>
  ) { }

  ngOnInit(): void {
    this.pregunta = this.defaults.pregunta;
  }

  cerrar(respuesta: string) {
    this.dialogRef.close(respuesta);
  }

}
