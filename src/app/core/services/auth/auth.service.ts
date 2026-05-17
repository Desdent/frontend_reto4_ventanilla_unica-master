import { computed, inject, Injectable, signal } from '@angular/core';
import { PublicUser } from '../../models/user/public-user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../../interfaces/auth/auth-response.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  apiUrl = 'http://localhost:3000/api/';

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<PublicUser | null>(null);
  private _token = signal<string | null>(null);

  // This is supposed to create, like, an observable?
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  token$ = this.tokenSubject.asObservable();

  private http = inject(HttpClient);

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) return 'authenticated';

    return 'not_authenticated';
  });

  user = computed<PublicUser | null>(() => this._user());
  token = computed(this._token);

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((resp) => {
          this._user.set(resp.data.user);
          this._authStatus.set('authenticated');
          this._token.set(resp.data.token);

          localStorage.setItem('token', resp.data.token);
          this.tokenSubject.next(this._token());
        }),
        map(() => true),
        catchError((error: any) => {
          this._user.set(null);
          this._token.set(null);
          this._authStatus.set('not-authenticated');

          return of(false);
        }),
      );
    // tap is to activate "side effects" (??)
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    return '';
  }

  register(data: PublicUser) {
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/register`, data).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error:', error.error);
        return of(false);
      }),
    );
  }

  // Not using it
  // checkTokenValid(token: string) {
  //   return this.http.get<AuthResponse>(`${this.apiUrl}auth/isJwtValid`).pipe(
  //     tap((resp) => {
  //       return of(true);
  //     }),
  //     map(() => true),
  //     catchError((error: any) => {
  //       return of(false);
  //     }),
  //   );
  // }
}
