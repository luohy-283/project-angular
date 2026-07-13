import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UserRole = 'ADMIN' | 'USER';

export interface AuthUser {
  username: string;
  role: UserRole;
}

export interface Account {
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  authorities: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'current_user';
  private readonly currentAccountSubject = new BehaviorSubject<Account | null>(null);

  readonly currentAccount$ = this.currentAccountSubject.asObservable();

  constructor() {
    if (this.getToken()) {
      this.getAccount()
        .pipe(
          tap((account) => {
            this.currentAccountSubject.next(account);
            this.persistCurrentUser(this.mapAccountToAuthUser(account));
          }),
          catchError(() => {
            this.clearAuthState();
            return of(null);
          }),
        )
        .subscribe();
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ id_token: string }>(`${environment.apiUrl}/authenticate`, {
        username,
        password,
        rememberMe: false,
      })
      .pipe(
        tap((response) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(this.tokenKey, response.id_token);
          }
        }),
        switchMap(() => this.getAccount()),
        tap((account) => {
          this.currentAccountSubject.next(account);
          this.persistCurrentUser(this.mapAccountToAuthUser(account));
        }),
        map(() => true),
        catchError(() => {
          this.clearAuthState();
          return of(false);
        }),
      );
  }

  logout(): void {
    this.clearAuthState();
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
  }

  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem(this.userKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      return null;
    }
  }

  getCurrentRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.tokenKey);
  }

  getAccount(): Observable<Account> {
    return this.http.get<Account>(`${environment.apiUrl}/account`);
  }

  private mapAccountToAuthUser(account: Account): AuthUser {
    const role: UserRole = account.authorities.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';

    return {
      username: account.login,
      role,
    };
  }

  private persistCurrentUser(currentUser: AuthUser): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.userKey, JSON.stringify(currentUser));
  }

  private clearAuthState(): void {
    this.currentAccountSubject.next(null);

    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(this.tokenKey);
    window.localStorage.removeItem(this.userKey);
  }
}
