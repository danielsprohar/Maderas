import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SnackbarMessageType } from './snackbar-message-type';
import { SnackbarState } from './snackbar-state';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbarSubject = new Subject<SnackbarState>();
  public state = this.snackbarSubject.asObservable();

  constructor() {}

  /**
   * Displays the visibility of the snackbar.
   *
   * @param message The message to display in the snackbar
   * @param type The message type. For example, success, warning, error, etc.
   */
  show(message: string, type?: SnackbarMessageType): void {
    this.snackbarSubject.next({
      message,
      type: type ?? SnackbarMessageType.Info,
    });
  }
}
