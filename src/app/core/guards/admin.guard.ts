import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  rolReal: string;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const { rolEsperado } = route.data;

    if (!this.tokenService.isLogged()) {
      this.router.navigate(['/entrar']);
      return false;
    } 

    this.rolReal = this.tokenService.getUsuarioJWT().roles[0].nombre; // admin || venta || inventario

    if (rolEsperado.indexOf(this.rolReal) < 0) {
      this.router.navigate(['/entrar']);
      return false;
    }

    return true;
  }
  
}
