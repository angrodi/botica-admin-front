import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.tokenService.isLogged()) { // login
      return next.handle(req);
    }

    const token: string = this.tokenService.getToken();

    let request = this.addToken(req, token);
    
    return next.handle(request)
      .pipe(
        catchError( (err: HttpErrorResponse) => {
          console.log(err);
          if (err.status === 401) {
            this.tokenService.logout();
            return throwError(err);
          } 
        })
      );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        authorization: `Bearer ${token}`
      }
    });
  }
}
