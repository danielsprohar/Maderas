import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppLoadingService {
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {}

  public isLoading(value: boolean): void {
    this.isLoadingSubject.next(value);
  }
}
