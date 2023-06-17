import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/shared/interfaces/categoria.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  apiURL = environment.apiURL + '/api/categorias/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public find(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL);
  }

  public findById(id: number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + id);
  }

  public create(categoria: Categoria): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, categoria);
  }

  public update(id: number, categoria: Categoria): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + id, categoria);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + id);
  }
}
