import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-no-auth',
  templateUrl: './no-auth.html',
  styleUrl: './no-auth.css',
  imports: [RouterOutlet],
})
export class NoAuth implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
