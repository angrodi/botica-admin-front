import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from 'src/app/shared/interfaces/rol.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  apiURL = environment.apiURL + '/api/roles/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public find(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL);
  }

  public findById(id: number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + id);
  }

  public create(rol: Rol): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, rol);
  }

  public update(id: number, rol: Rol): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + id, rol);
  }
}
