import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppLoadingService } from './services/app-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private navStartSubscription: Subscription;
  private navCanceledSubscription: Subscription;
  private navErrorSubscription: Subscription;
  private navEndSubscription: Subscription;

  constructor(
    private readonly router: Router,
    public readonly loadingService: AppLoadingService
  ) {}

  ngOnInit(): void {
    // Reference:
    // https://angular.io/guide/router#router-events
    this.navStartSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => this.loadingService.isLoading(true));

    this.navCanceledSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationCancel))
      .subscribe(() => this.loadingService.isLoading(false));

    this.navErrorSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationError))
      .subscribe(() => this.loadingService.isLoading(false));

    this.navEndSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.loadingService.isLoading(false));
  }

  ngOnDestroy(): void {
    if (this.navStartSubscription) {
      this.navStartSubscription.unsubscribe();
    }
    if (this.navCanceledSubscription) {
      this.navCanceledSubscription.unsubscribe();
    }
    if (this.navErrorSubscription) {
      this.navErrorSubscription.unsubscribe();
    }
    if (this.navEndSubscription) {
      this.navEndSubscription.unsubscribe();
    }
  }
}
