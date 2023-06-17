import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from 'src/app/shared/interfaces/proveedor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  apiURL = environment.apiURL + '/api/proveedores/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public find(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL);
  }

  public findById(id: number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + id);
  }

  public create(proveedor: Proveedor): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, proveedor);
  }

  public update(id: number, proveedor: Proveedor): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + id, proveedor);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + id);
  }
}
