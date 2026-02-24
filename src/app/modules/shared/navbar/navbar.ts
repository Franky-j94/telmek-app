import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { AuthService } from '../../../services/auth-service';
import { NoAuth } from '../../../services/no-auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [CommonModule, RouterLink]
})
export class Navbar implements OnInit {

  public notifications = [];
  public user: any = [];
  public full_name: string;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    public noAuthService: NoAuth
  ) {
    this.full_name = this.authService.getUserSession().login ?? '';
  }

  ngOnInit(): void {
    console.log(this.notifications)
  }

  public logOut(): void {
    this.userService.logout();
    this.noAuthService.signOut(this.authService.getUserSession()).subscribe({
      next: (response: any) => {
        this.authService.destroySession();
      }
    })
  }
}
