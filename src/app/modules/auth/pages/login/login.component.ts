import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UsuarioLogin } from 'src/app/shared/interfaces/usuario-login.interface';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email   : ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required ]]
    });
  }

  iniciarSesion(): void {
    const usuarioLogin: UsuarioLogin = this.form.value;

    this.authService.login(usuarioLogin)
      .subscribe(response => {
        this.tokenService.setToken(response.token);

        this.router.navigate(['/admin']);
        this.mostrarSnackbar('Bienvenido al panel de administración');
      }, err => {
        if (err.status === 401) {
          if (err.error.error === 'Usuario desactivado') {
            this.mostrarSnackbar('Su cuenta ha sido desactivada', 'red-snackbar');
          } else {
            this.mostrarSnackbar('Datos incorrectos', 'red-snackbar');
          }
        } else {
          this.mostrarSnackbar('Error al iniciar sesión', 'red-snackbar');
        }
      });


  }

  toggleVisibility() {
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

  private mostrarSnackbar(mensaje: string, ...clases: string[]): void {
    this.snackbar.open(mensaje, 'OK', {
      duration: 3000,
      panelClass: clases
    });
  }

  errorCampoRequerido(campo: string): boolean {
    return this.form.get(campo).errors?.required && this.form.get(campo).touched;
  }

  errorEmailInvalido(): boolean {
    return this.form.get('email').errors?.email && this.form.get('email').touched;
  }
}
