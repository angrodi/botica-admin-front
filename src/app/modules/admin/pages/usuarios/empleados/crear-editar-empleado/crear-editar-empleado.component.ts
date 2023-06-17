import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
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
import { RolService } from 'src/app/core/services/rol.service';
import { Rol } from 'src/app/shared/interfaces/rol.interface';
import { ValidatorService } from 'src/app/core/services/validator.service';


@Component({
  selector: 'vex-crear-editar-empleado',
  templateUrl: './crear-editar-empleado.component.html',
  styleUrls: ['./crear-editar-empleado.component.scss']
})
export class CrearEditarEmpleadoComponent implements OnInit {

  modo: 'crear' | 'editar';
  form: FormGroup;
  usuario: Usuario;
  roles: Rol[];

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
    private dialogRef: MatDialogRef<CrearEditarEmpleadoComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private rolService: RolService,
    private validatorService: ValidatorService
  ) {}

  ngOnInit(): void {
    this.modo = this.defaults.modo;

    if (this.defaults.usuario) {
      this.usuario = this.defaults.usuario;
      this.usuario.rolId = this.usuario.roles[0].id;
    } else {
      this.usuario = {} as Usuario;
    }

    this.form = this.fb.group({
      nombres   : [this.usuario.nombres, [ Validators.required ]],
      apellidos : [this.usuario.apellidos, [ Validators.required ]],
      dni       : [this.usuario.dni, [ Validators.required, Validators.pattern(this.validatorService.dniPattern) ]],
      email     : [this.usuario.email, [ Validators.required, Validators.email ]],
      password  : [this.usuario.password, [ Validators.required ]],
      telefono  : [this.usuario.telefono, [ Validators.required ]],
      direccion : [this.usuario.direccion, [ Validators.required ]],
      rolId     : [this.usuario.rolId, [ Validators.required ]],
      estado    : [this.usuario.estado, [ Validators.required ]]
    });

    if (this.modo === 'editar') {
      this.form.removeControl('password');
    }

    this.cargarRoles();
  }

  guardar(): void {
    if (this.modo === 'crear') {
      this.crearUsuario();
    } else if (this.modo === 'editar') {
      this.actualizarUsuario();
    }
  }

  crearUsuario(): void {
    // Actualizando valores
    Object.assign(this.usuario, this.form.value);

    this.dialogRef.close(this.usuario);
  }

  actualizarUsuario(): void {
    // Actualizando valores
    Object.assign(this.usuario, this.form.value);

    this.dialogRef.close(this.usuario);
  }

  esModoCrear(): boolean {
    return this.modo === 'crear';
  }

  esModoEditar(): boolean {
    return this.modo === 'editar';
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

  private cargarRoles(): void {
    this.rolService.find()
      .subscribe(response => {
        this.roles = response.data;
      })
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
