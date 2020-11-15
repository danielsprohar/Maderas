import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResponse } from '../wrappers/paginated-response';

// ==========================================================================

const httpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
});

// ==========================================================================

@Injectable({
  providedIn: 'root',
})
export class DataService<T> {
  constructor(private readonly http: HttpClient) {}

  getAll(path: string, params?: HttpParams): Observable<PaginatedResponse<T>> {
    const url = environment.apiUrl + path;

    return this.http
      .get<PaginatedResponse<T>>(url, {
        headers: httpHeaders,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  // ==========================================================================

  query(path: string, params?: HttpParams): Observable<any> {
    const url = environment.apiUrl + path;
    return this.http
      .get<T | number>(url, {
        headers: httpHeaders,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  // ==========================================================================

  get(path: string): Observable<T> {
    const url = environment.apiUrl + path;

    return this.http
      .get<T>(url, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // ==========================================================================

  update(path: string, data: T, params?: HttpParams): Observable<T> {
    const url = environment.apiUrl + path;

    return this.http
      .put<T>(url, data, { headers: httpHeaders, params })
      .pipe(catchError(this.handleError));
  }

  // ==========================================================================

  create(path: string, data: T): Observable<T> {
    const url = environment.apiUrl + path;

    return this.http
      .post<T>(url, data, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // ==========================================================================

  remove(path: string): Observable<T> {
    const url = environment.apiUrl + path;

    return this.http
      .delete<T>(url, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // ==========================================================================

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
