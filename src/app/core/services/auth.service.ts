import { Injectable } from '@angular/core';

export type UserRole = 'ADMIN' | 'USER';

export interface AuthUser {
  username: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'current_user';

  private readonly mockAccounts: { username: string; password: string; role: UserRole }[] = [
    { username: 'admin', password: 'admin', role: 'ADMIN' },
    { username: 'user', password: 'user', role: 'USER' },
  ];

  login(username: string, password: string): boolean {
    const account = this.mockAccounts.find((item) => item.username === username && item.password === password);

    if (!account) {
      this.clearAuthState();
      return false;
    }

    const currentUser: AuthUser = { username: account.username, role: account.role };
    this.persistAuthState(currentUser);
    return true;
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

  private persistAuthState(currentUser: AuthUser): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.tokenKey, 'mock-access-token');
    window.localStorage.setItem(this.userKey, JSON.stringify(currentUser));
  }

  private clearAuthState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(this.tokenKey);
    window.localStorage.removeItem(this.userKey);
  }
}
