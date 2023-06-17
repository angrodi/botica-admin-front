import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  apiURL = environment.apiURL + '/api/pedidos/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public find(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL);
  }

  public findById(id: number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + id);
  }

  public create(pedido: Pedido): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, pedido);
  }

  public update(id: number, pedido: Pedido): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + id, pedido);
  }

  public patch(id: number, pedido: Pedido): Observable<any> {
    return this.httpClient.patch<any>(this.apiURL + id, pedido);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + id);
  }
}
