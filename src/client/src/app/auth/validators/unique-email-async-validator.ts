import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export class UniqueEmailAsyncValidator {
  static create(auth: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return auth.validateEmail(control.value).pipe(
        debounceTime(1000),
        // Set the 'emailIsTaken' flag to
        // inform the consumer that the email already exists in the db.
        map((isTaken) => (isTaken ? { emailIsTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
