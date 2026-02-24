import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SolicitudesEntity } from '../entities/solicitudes';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesServices {
  private readonly apiUrlPrefix;

  constructor(private readonly httpClient: HttpClient) {
    this.apiUrlPrefix = `${environment.apiUrl}/${environment.prefix}/solicitudes`;
  }

  get(): Observable<SolicitudesEntity[]> {
    return this.httpClient.get<SolicitudesEntity[]>(`${this.apiUrlPrefix}`);
  }
  getUsersVentas(): Observable<SolicitudesEntity[]> {
    return this.httpClient.get<SolicitudesEntity[]>(`${this.apiUrlPrefix}/users-ventas`);
  }
  store(payload: SolicitudesEntity): Observable<SolicitudesEntity> {
    return this.httpClient.post<SolicitudesEntity>(`${this.apiUrlPrefix}`, payload);
  }
  update(id: number, payload: SolicitudesEntity): Observable<SolicitudesEntity> {
    return this.httpClient.put<SolicitudesEntity>(`${this.apiUrlPrefix}/${id}`, payload);
  }
  destroy(id: number): Observable<SolicitudesEntity> {
    return this.httpClient.delete<SolicitudesEntity>(`${this.apiUrlPrefix}/${id}`);
  }
  cancelar(id: number): Observable<SolicitudesEntity> {
    return this.httpClient.delete<SolicitudesEntity>(`${this.apiUrlPrefix}/cancelar/${id}`);
  }
}
