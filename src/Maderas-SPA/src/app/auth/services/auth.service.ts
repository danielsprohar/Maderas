import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(): void {
    const url = environment.apiUrl + '/login';
  }

  register(): void {
    const url = environment.apiUrl + '/register';
  }

  validateEmail(email: string): Observable<{}> {
    const url = environment.apiUrl + '/users/search';
    const params = new HttpParams().set('email', email.trim());
    return this.http.get(url, { params });
  }
}
