import { Component, OnDestroy, OnInit } from '@angular/core';
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
  private readonly subscriptions: Subscription[] = [];
  private readonly bulmaHelpers = [
    'has-background-danger',
    'has-background-info',
    'has-background-success',
    'has-background-warning',
  ];

  public message: string;

  constructor(public readonly snackbarService: SnackbarService) {}

  ngOnInit(): void {
    const sub = this.snackbarService.state.subscribe((state: SnackbarState) => {
      this.show(state);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private show(state: SnackbarState): void {
    this.message = state.message;

    const snackbar = document.getElementById('snackbar');

    switch (state.type) {
      case SnackbarMessageType.Danger:
        snackbar.classList.add(this.bulmaHelpers[0]);
        snackbar.style.color = '#fff';
        break;
      case SnackbarMessageType.Info:
        snackbar.classList.add(this.bulmaHelpers[1]);
        snackbar.style.color = '#fff';
        break;
      case SnackbarMessageType.Success:
        snackbar.classList.add(this.bulmaHelpers[2]);
        snackbar.style.color = '#fff';
        break;
      case SnackbarMessageType.Warning:
        snackbar.classList.add(this.bulmaHelpers[3]);
        snackbar.style.color = '#000';
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
