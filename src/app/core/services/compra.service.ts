import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra } from 'src/app/shared/interfaces/compra.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  apiURL = environment.apiURL + '/api/compras/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public find(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL);
  }

  public findById(id: number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + id);
  }

  public create(compra: Compra): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, compra);
  }

  public update(id: number, compra: Compra): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + id, compra);
  }
  
  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + id);
  }
}
