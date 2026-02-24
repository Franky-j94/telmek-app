import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { GenericResponse, SessionData } from '../entities/no-auth';
import { LocalStorage } from './local-storage';
import { NoAuth } from './no-auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private authStatusSubject = new BehaviorSubject<boolean>(this.isTokenValid());
  authStatus$ = this.authStatusSubject.asObservable(); // puedes usar esto en componentes

  constructor(private localStorage: LocalStorage, private routing: Router, private auth: NoAuth) { }

  initSession(data: GenericResponse<SessionData>): void {
    this.localStorage.clear();
    this.localStorage.setObject('session', data.data);
    this.localStorage.set('token', data.data.access_token);
    this.authStatusSubject.next(true);
  }

  getToken(): string {
    try {
      const token = this.localStorage?.get?.('token');
      return token || '';
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return '';
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 160000); // segundos para el token
      return payload.exp && payload.exp > now;
    } catch {
      return false;
    }
  }

  isAuth(): boolean {
    const valid = this.isTokenValid();
    this.authStatusSubject.next(valid)
    return valid;
  }

  destroySession(): void {
    this.localStorage.clear();
    this.routing.navigateByUrl('/no-auth/sign-in');
  }

  getUserSession(): SessionData {
    return this.localStorage.getObject('session');
  }

  isTokenAboutToExpire(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      const remaining = payload.exp - now;
      return remaining < 60; // menos de minuto para expirar
    } catch {
      return false;
    }
  }

  refreshToken(): Observable<boolean> {
    const user = this.getUserSession();
    const oldToken = this.getToken();
    //if (!user || !oldToken) return Promise.resolve(false);

    return this.auth.refreSession(user.login).pipe(
      map((response: any) => {
        if (response?.data?.token) {
          const session = this.localStorage.getObject('session');
          session.token = response.data.token;
          this.localStorage.set('token', response.data.token);
          this.localStorage.setObject('session', session);
          this.authStatusSubject.next(true);
          console.log(' Token renovado automáticamente');
          return true;
        }
        return false;
      }),
      catchError((err) => {
        console.error('Error al refrescar token:', err);
        return of(false);
      })
    );

  }
}
