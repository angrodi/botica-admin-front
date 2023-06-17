import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenDTO } from 'src/app/shared/interfaces/token-dto.interface';
import { environment } from 'src/environments/environment';
import { UsuarioLogin } from '../../shared/interfaces/usuario-login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiURL = environment.apiURL + '/api/auth/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public login(usuario: UsuarioLogin): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'login', usuario);
  }

  public logout(tokenDTO: TokenDTO): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'logout', tokenDTO);
  }

  public refresh(tokenDTO: TokenDTO): Observable<TokenDTO> {
    return this.httpClient.post<TokenDTO>(this.apiURL + 'refresh', tokenDTO);
  }

}
