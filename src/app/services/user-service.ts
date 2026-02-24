import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../entities/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrlPrefix;

  private signOutEvent = new Subject<void>();
  public signOutEvent$ = this.signOutEvent.asObservable();

  constructor(private readonly httpClient: HttpClient) {
    this.apiUrlPrefix = `${environment.apiUrl}` + `/${environment.prefix}` + `/usuarios`;
  }

  get(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrlPrefix}`);
  }
  store(payload: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrlPrefix}`, payload);
  }
  update(id: number, payload: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrlPrefix}/${id}`, payload);
  }
  destroy(id: number): Observable<User> {
    return this.httpClient.delete<User>(`${this.apiUrlPrefix}/${id}`);
  }

  logout(): void {
    this.signOutEvent.next();
  }
}
