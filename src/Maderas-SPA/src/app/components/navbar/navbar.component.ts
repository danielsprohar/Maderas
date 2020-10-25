import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  toggleMenu(): void {
    const navbarMenu = document.getElementById('navbarMenu');
    navbarMenu.classList.toggle('is-active');

    const navbarBurger = document.getElementById('navbarBurger');
    navbarBurger.classList.toggle('is-active');
  }
}
