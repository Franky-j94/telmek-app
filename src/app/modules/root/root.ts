import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { NoAuth } from '../../services/no-auth';
import { Sidebar } from "../shared/sidebar/sidebar";
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './root.html',
  styleUrl: './root.css',
  imports: [Sidebar, RouterOutlet, Navbar]
})
export class Root implements OnInit, OnDestroy {

  public showSidebar: boolean = true;
  public showNavbar: boolean = true;
  public showFooter: boolean = true;

  public isLoading: boolean = false;
  public logOutSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private noAuthService: NoAuth
  ) {
    this.router.events.forEach((event) => {
      //console.log("HERE:", event)
      if (event instanceof NavigationStart) {
        if (event.url == 'no-auth/sign-in' || (event['url'] == '/error-pages/404')) {
          this.showSidebar = false;
          this.showNavbar = false;
          this.showFooter = false;
        } else {
          this.showSidebar = true;
          this.showNavbar = true;
          this.showFooter = true;

          document.querySelector('.main-panel')?.classList.remove('w-100');
          document.querySelector('.page-body-wrapper')?.classList.remove('full-page-wrapper');
          document.querySelector('.content-wrapper')?.classList.remove('auth', 'auth-img-bg');
          document.querySelector('.content-wrapper')?.classList.remove('p-0');
        }
      }
    })
  }

  ngOnInit(): void {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    const stillValid = this.authService.isAuth(); // fuerza validación inicial

    if (!stillValid) {
      this.authService.destroySession();
    }

    this.authService.authStatus$.subscribe(isAuthentication => {
      // evita repetir la destrucción si ya lo hiciste
      if (!isAuthentication && stillValid) {
        this.authService.destroySession();
      }
    });

  }
  ngOnDestroy(): void {
    this.logOutSubscription.unsubscribe();
  }
}
