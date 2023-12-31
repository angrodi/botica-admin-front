import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | boolean {
   
      if (this.tokenService.isLogged()) {
        this.router.navigate(['/admin']);
        return false;
      }
      return true;
  }
  
}
