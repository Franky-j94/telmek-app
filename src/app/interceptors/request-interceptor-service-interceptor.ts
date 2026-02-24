import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ToastHandler } from '../services/toast-handler';
import { inject } from '@angular/core';

/*
export const requestInterceptorServiceInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};*/

export const RequestInterceptorServiceInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const toastHandlerService = inject(ToastHandler);

  if (authService.isAuth()) {
    const user = authService.getUserSession();

    if (user?.access_token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.access_token}`
        }
      });
    }
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/logout')) {
        authService.destroySession();
        toastHandlerService.error('Sesión expirada', 'Inicie sesión nuevamente');
        router.navigate(['/no-auth/sign-in']);
      }

      return throwError(() => error);
    })
  );
};

/*
export class RequestInterceptorServiceInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private toastHandlerService: ToastHandler) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();
    if (this.authService.isAuth()) {
      const user = this.authService.getUserSession();
      if (!this.authService.isTokenValid()) {
        this.handleUnauthorized();
        return throwError(() => new Error('Token expirado'));
      }
      if (user?.access_token && user?.login) {
        headers = headers.set('Authorization', `Bearer ${user.access_token}`);
      }
    }

    const modifiedRequest = req.clone({ headers });

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleUnauthorized();  // token expirado, redirige
        } else {
          this.handleOtherErrors(error);
        }

        return throwError(() => error);
      })
    );

  }

  private handleUnauthorized(): void {
    this.authService.destroySession(); // limpia el localStorage
    this.toastHandlerService.error('Sesión expirada', 'Por favor, inicie sesión nuevamente.');
    this.router.navigate(['/no-auth/sign-in']); // redirige
  }

  private handleOtherErrors(error: HttpErrorResponse): void {
    let message = 'Ha ocurrido un error inesperado.';
    let title = '';

    if (error.status === 0) {
      message = 'Conexión incorrecta. Verifique su conexión.';
    } else if (error.status === 406) {
      message = error.error?.mensaje ?? message;
    } else if (error.status !== 500) {
      message = error.error?.data ?? message;
    }

    this.toastHandlerService.error(title, message);
  }

}
*/


