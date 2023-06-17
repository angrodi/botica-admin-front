import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import icPicture from '@iconify/icons-ic/twotone-picture-in-picture';
import icEmail from '@iconify/icons-ic/twotone-alternate-email';
import icSupervisedUser from '@iconify/icons-ic/twotone-supervised-user-circle';

import { Cliente } from '../../../../../../shared/interfaces/cliente.interface';
import { ValidatorService } from 'src/app/core/services/validator.service';


@Component({
  selector: 'vex-crear-editar-cliente',
  templateUrl: './crear-editar-cliente.component.html',
  styleUrls: ['./crear-editar-cliente.component.scss']
})
export class CrearEditarClienteComponent implements OnInit {

  modo: 'crear' | 'editar';
  form: FormGroup;
  cliente: Cliente;

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPerson = icPerson;
  icPicture = icPicture;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  icEmail = icEmail;
  icSupervisedUser = icSupervisedUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CrearEditarClienteComponent>,
    private fb: FormBuilder,
    private validatorService: ValidatorService
  ) {}

  ngOnInit(): void {
    this.modo = this.defaults.modo;

    if (this.defaults.cliente) {
      this.cliente = this.defaults.cliente;
    } else {
      this.cliente = {} as Cliente;
    }

    this.form = this.fb.group({
      nombres   : [this.cliente.nombres, [ Validators.required ]],
      apellidos : [this.cliente.apellidos, [ Validators.required ]],
      dni       : [this.cliente.dni, [ Validators.required, Validators.pattern(this.validatorService.dniPattern) ]],
      email     : [this.cliente.email, [ Validators.email ]],
      telefono  : [this.cliente.telefono, [ Validators.required ]],
      direccion : [this.cliente.direccion, [ Validators.required ]]
    });
  }

  guardar(): void {
    if (this.modo === 'crear') {
      this.crearCliente();
    } else if (this.modo === 'editar') {
      this.actualizarCliente();
    }
  }

  crearCliente(): void {
    this.cliente = this.form.value;

    this.dialogRef.close(this.cliente);
  }

  actualizarCliente(): void {
    // Actualizando valores
    Object.assign(this.cliente, this.form.value);

    this.dialogRef.close(this.cliente);
  }

  esModoCrear(): boolean {
    return this.modo === 'crear';
  }

  esModoEditar(): boolean {
    return this.modo === 'editar';
  }
  
  errorCampoRequerido(campo: string): boolean {
    return this.form.get(campo).errors?.required && this.form.get(campo).touched;
  }

  errorEmailInvalido(): boolean {
    return this.form.get('email').errors?.email && this.form.get('email').touched;
  }

  errorFormatoDNI(): boolean {
    return this.form.get('dni').errors?.pattern && this.form.get('dni').touched;
  } 
}
