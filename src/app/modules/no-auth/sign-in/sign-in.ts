import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoAuth } from '../../../services/no-auth';
import { ToastHandler } from '../../../services/toast-handler';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit {
  public form!: FormGroup;

  error: string | null = '';
  fadeOut: boolean = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private noAuthService: NoAuth,
    private authService: AuthService,
    private toastService: ToastHandler
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {

    const payload = {
      login: this.form.get('login')?.value,
      password: this.form.get('password')?.value
    }
    this.noAuthService.signIn(payload).subscribe({
      next: (resp: any) => {

        //localStorage.setItem('token', resp.access_token);
        this.authService.initSession(resp);
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.log(["error", err.error]);
        //this.error = err.error?.error || 'Error al iniciar sesión';
        // Desaparece en 30 segundos
        this.toastService.error('', err.error?.error || 'Error al iniciar sesión');
        this.cdr.detectChanges();
      }
    });

  }

  showError(message: string) {
    this.error = message;
    this.fadeOut = false;

    setTimeout(() => {
      this.fadeOut = true;
    }, 4000);

    setTimeout(() => {
      this.error = null;
    }, 4500);
  }
}
