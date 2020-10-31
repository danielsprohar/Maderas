import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private routerSubscription: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.addRouterListener();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private addRouterListener(): void {
    this.router.setUpLocationChangeListener();

    this.routerSubscription = this.router.events.subscribe((next) => {
      const navbarMenu = document.getElementById('navbarMenu');
      navbarMenu.classList.remove('is-active');

      const navbarBurger = document.getElementById('navbarBurger');
      navbarBurger.classList.remove('is-active');
    });
  }
}
