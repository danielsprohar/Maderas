import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(public readonly auth: AuthService) {}

  ngOnInit(): void {}

  toggleMenu(): void {
    const navbarMenu = document.getElementById('navbarMenu');
    navbarMenu.classList.toggle('is-active');

    const navbarBurger = document.getElementById('navbarBurger');
    navbarBurger.classList.toggle('is-active');
  }
}
