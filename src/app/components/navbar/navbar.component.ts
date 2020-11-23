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
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
