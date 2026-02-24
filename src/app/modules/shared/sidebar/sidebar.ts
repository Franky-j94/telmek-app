import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { User } from '../../../entities/user';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {

  public visible: boolean;

  public fullName: string;
  public role: string;
  public navigation: any;
  //private menuSubscription: Subscription;
  public isLoading: boolean = false;
  public user: User[] = [];
  public menus = [
    { name: 'Dashboard', icon: 'fa fa-home' },
    { name: 'Productos', icon: 'fa fa-home' },
    { name: 'Inventario', icon: 'fa fa-home' },
    { name: 'Politicas', icon: 'fa fa-home' },
    { name: 'Usuarios', icon: 'fa fa-user-circle' }
  ]
  hoveredIndex: number | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private routing: Router
  ) {
    this.visible = false;
    this.fullName = "Francisco";
    this.role = "";
  }

  ngOnInit(): void {
    /*document.querySelectorAll('.navigation li').forEach(function (ele){
      ele.addEventListener('mouseover', function(){
        ele.classList.remove('hovered');
        ele.classList.add('hovered');
      })
    })*/
    /*let list = document.querySelectorAll('.navigation li');
    function activeLink(){
      list.forEach((item) => item.classList.remove('hovered'));
      this.classList.add('hovered');
    }  
    list.forEach((item)=> )*/
  }

  /*ngAfterViewInit(): void {
    $('#menu-toggle').on('click', function () {
      $('#sidebar').toggleClass('collapsed');
    });

  }*/

  setHovered(index: number): void {
    this.hoveredIndex = index;
  }

  clearHovered(): void {
    this.hoveredIndex = null;
  }
}
