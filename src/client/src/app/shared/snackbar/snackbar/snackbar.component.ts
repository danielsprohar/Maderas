import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarMessageType } from '../snackbar-message-type';
import { SnackbarState } from '../snackbar-state';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
})
export class SnackbarComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private readonly bulmaHelpers = [
    'has-background-danger',
    'has-background-info',
    'has-background-success',
    'has-background-warning',
  ];

  public message: string;

  constructor(
    private readonly renderer: Renderer2,
    public readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.subscription = this.snackbarService.state$.subscribe(
      (state: SnackbarState) => {
        this.show(state);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private show(state: SnackbarState): void {
    this.message = state.message;

    const snackbar = document.getElementById('snackbar');

    switch (state.type) {
      case SnackbarMessageType.Danger:
        this.renderer.addClass(snackbar, this.bulmaHelpers[0]);
        this.renderer.setStyle(snackbar, 'color', '#fff');
        break;
      case SnackbarMessageType.Info:
        this.renderer.addClass(snackbar, this.bulmaHelpers[1]);
        this.renderer.setStyle(snackbar, 'color', '#fff');
        break;
      case SnackbarMessageType.Success:
        this.renderer.addClass(snackbar, this.bulmaHelpers[2]);
        this.renderer.setStyle(snackbar, 'color', '#fff');
        break;
      case SnackbarMessageType.Warning:
        this.renderer.addClass(snackbar, this.bulmaHelpers[3]);
        this.renderer.setStyle(snackbar, 'color', '#000');
        break;
      default:
        break;
    }

    snackbar.classList.toggle('show');

    setTimeout(() => {
      // snackbar.className = snackbar.className.replace('show', '');
      snackbar.classList.remove('show');
    }, 3000);
  }
}
