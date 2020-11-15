import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/auth-response';
import { LoginModel } from '../models/login-model';
import { RegisterModel } from '../models/register-model';

// ===========================================================================

const httpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
});

// ===========================================================================

// The key for getting/setting data in local storage.
const jwtStorageKey = 'maderas';

// The key for getting/setting the current user in local storage.
const currentUser = 'maderas_cu';

// ===========================================================================

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private readonly userSubject = new BehaviorSubject<User>(null);

  constructor(private readonly http: HttpClient) {}

  login(user: LoginModel): Observable<AuthResponse> {
    const url = environment.authUrl + '/login';

    return this.http
      .post<AuthResponse>(url, user, { headers: httpHeaders })
      .pipe(
        tap((res) => {
          if (res.user && res.token) {
            this.persist(res);
          }
        }),
        shareReplay(),
        catchError(this.handleError)
      );
  }

  // =========================================================================

  register(user: RegisterModel): Observable<AuthResponse> {
    const url = environment.authUrl + '/register';

    return this.http
      .post<AuthResponse>(url, user, { headers: httpHeaders })
      .pipe(
        tap((res) => {
          if (res.user && res.token) {
            this.persist(res);
          }
        }),
        shareReplay(),
        catchError(this.handleError)
      );
  }

  /**
   * Checks the database for an existing email.
   * If the email exists, then a number greater than 0 is returned,
   * otherwise 0.
   *
   * @param email the user's email to validate
   */
  validateEmail(email: string): Observable<{}> {
    const url = environment.apiUrl + '/users/email-count';
    const params = new HttpParams().set('email', email.trim());
    return this.http.get(url, { params });
  }

  // =========================================================================

  /**
   * Check if the token is expired.
   *
   * @see https://tools.ietf.org/html/rfc7519#section-4.1.4
   */
  isTokenValid(): boolean {
    const token = localStorage.getItem(jwtStorageKey);
    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwt_decode(token);
      const exp = Number(decodedToken.exp);

      // Convert milliseconds to seconds
      const now = Date.now().valueOf() / 1000;

      return now < exp;
    } catch (err) {
      return false;
    }
  }

  // =========================================================================

  isLoggedIn(): boolean {
    // Check if the token is localStorage.
    // A hack for when the user refreshes the page.
    if (this.getAuthorizationToken()) {
      this.isLoggedInSubject.next(true);
      return true;
    }

    return false;
  }

  // =========================================================================

  getAuthorizationToken(): string {
    return localStorage.getItem(jwtStorageKey);
  }

  // =========================================================================

  getUser(): User {
    const stringifiedUser = localStorage.getItem(currentUser);
    if (!stringifiedUser) {
      return null;
    }

    const user = JSON.parse(stringifiedUser) as User;
    this.userSubject.next(user);
    return user;
  }

  // =========================================================================

  private persist(res: AuthResponse): void {
    this.userSubject.next(res.user);
    this.isLoggedInSubject.next(true);

    localStorage.setItem(jwtStorageKey, res.token);
    localStorage.setItem(currentUser, JSON.stringify(res.user));
  }

  // =========================================================================

  logout(): void {
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);

    localStorage.removeItem(jwtStorageKey);
    localStorage.removeItem(currentUser);
  }

  // =========================================================================

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
    const message =
      error.status === 401
        ? error.error
        : 'Something bad happened; please try again later.';

    return throwError(message);
  }
}
