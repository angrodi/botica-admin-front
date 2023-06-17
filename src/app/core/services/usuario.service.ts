import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiURL = environment.apiURL + '/api/usuarios/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public find(params?: HttpParams): Observable<any> {
    if (params) {
      return this.httpClient.get<any>(this.apiURL, { params });
    }
    return this.httpClient.get<any>(this.apiURL);
  }

  public findById(id: number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + id);
  }

  public create(usuario: Usuario): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, usuario);
  }

  public update(id: number, usuario: Usuario): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + id, usuario);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + id);
  }
}
