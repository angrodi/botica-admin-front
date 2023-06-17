import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UsuarioJWT } from '../../shared/interfaces/usuario-jwt.interface';

const TOKEN_KEY = 'ACCESS_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  apiURL = environment.apiURL + '/api/auth/';

  constructor(
    private router: Router
  ) { }

  public setToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  public getUsuarioJWT(): UsuarioJWT {
    if (!this.isLogged()) {
      return null;
    }

    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    
    const data: UsuarioJWT = {
      id: values.sub,
      nombre: values.nombre,
      roles: values.roles
    }

    return data;
  }

  public userLoggedIsAdmin(): boolean {
    if (!this.isLogged()) return false;

    const rol = this.getUsuarioJWT().roles[0].nombre;

    return (rol === 'admin') ? true : false;
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/entrar']);
  }

}
