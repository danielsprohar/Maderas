import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private readonly router: Router,
    public readonly auth: AuthService) {}

  ngOnInit(): void {}

  toggleMenu(): void {
    const navbarMenu = document.getElementById('navbarMenu');
    navbarMenu.classList.toggle('is-active');

    const navbarBurger = document.getElementById('navbarBurger');
    navbarBurger.classList.toggle('is-active');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
