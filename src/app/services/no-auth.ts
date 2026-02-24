import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SessionData, SignInData, SignOutData } from '../entities/no-auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoAuth {

  private readonly apiUrlPrefix;

  constructor(private readonly httpClient: HttpClient) {
    this.apiUrlPrefix = `${environment.apiUrl}` + `/${environment.prefix}`;
  }

  signIn(data: SignInData): Observable<SessionData> {
    return this.httpClient.post<SessionData>(`${this.apiUrlPrefix}/login`, data);
  }

  signOut(data: SignOutData): Observable<SignOutData> {
    return this.httpClient.post<SignOutData>(`${this.apiUrlPrefix}/logout`, data);
  }

  refreSession(id: string): Observable<SignInData> {
    return this.httpClient.post<SignInData>(`${this.apiUrlPrefix}/keep-live`, id);
  }
}
