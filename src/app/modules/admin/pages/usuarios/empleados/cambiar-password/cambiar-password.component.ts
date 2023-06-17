import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
import icLock from '@iconify/icons-ic/twotone-lock';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';

import { Usuario } from '../../../../../../shared/interfaces/usuario.interface';

@Component({
  selector: 'vex-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent implements OnInit {

  form: FormGroup;
  usuario: Usuario;

  inputType: string = 'password';
  visible: boolean = false;

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
  icLock = icLock;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CambiarPasswordComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
 
    if (this.defaults.usuario) {
      this.usuario = this.defaults.usuario;
      this.usuario.rolId = this.usuario.roles[0].id;
    } else {
      this.usuario = {} as Usuario;
    }

    this.form = this.fb.group({
      nombres   : [{ value: this.usuario.nombres, disabled: true }, [ Validators.required ]],
      apellidos : [{ value: this.usuario.apellidos, disabled: true }, [ Validators.required ]],
      dni       : [{ value: this.usuario.dni, disabled: true }, [ Validators.required ]],
      email     : [{ value: this.usuario.email, disabled: true }, [ Validators.required ]],
      password  : ['', [ Validators.required ]],
      telefono  : [{ value: this.usuario.telefono, disabled: true }, [ Validators.required ]],
      direccion : [{ value: this.usuario.direccion, disabled: true }, [ Validators.required ]],
      rolId     : [{ value: this.usuario.rolId, disabled: true }, [ Validators.required ]],
      estado    : [{ value: this.usuario.estado, disabled: true }, [ Validators.required ]]
    });
  }

  guardar(): void {
    this.actualizarUsuario();
  }

  actualizarUsuario(): void {
    // Actualizando valores
    Object.assign(this.usuario, this.form.value);
    
    this.dialogRef.close(this.usuario);
  }

  toggleVisibility(): void {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
