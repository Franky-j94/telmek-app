import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracionCargaEntity } from '../entities/configuracion-carga';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionCargaService {
  private readonly apiUrlPrefix;

  constructor(private readonly httpClient: HttpClient) {
    this.apiUrlPrefix = `${environment.apiUrl}/${environment.prefix}/configuracion-carga`;
  }

  get(): Observable<ConfiguracionCargaEntity[]> {
    return this.httpClient.get<ConfiguracionCargaEntity[]>(`${this.apiUrlPrefix}`);
  }
  store(payload: ConfiguracionCargaEntity): Observable<ConfiguracionCargaEntity> {
    return this.httpClient.post<ConfiguracionCargaEntity>(`${this.apiUrlPrefix}`, payload);
  }
  update(id: number, payload: ConfiguracionCargaEntity): Observable<ConfiguracionCargaEntity> {
    return this.httpClient.put<ConfiguracionCargaEntity>(`${this.apiUrlPrefix}/${id}`, payload);
  }
  destroy(id: number): Observable<ConfiguracionCargaEntity> {
    return this.httpClient.delete<ConfiguracionCargaEntity>(`${this.apiUrlPrefix}/${id}`);
  }
}
