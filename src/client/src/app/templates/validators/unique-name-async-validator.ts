import { HttpParams } from '@angular/common/http';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { Template } from 'src/app/models/template';
import { DataService } from 'src/app/services/data.service';

export class UniqueTemplateNameAsyncValidator {
  static create(service: DataService<Template>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const path = '/templates/is-available';
      const params = new HttpParams().set('name', control.value);

      return service.query(path, params).pipe(
        debounceTime(1000),
        map((isAvailable) => (!isAvailable ? { nameIsTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
