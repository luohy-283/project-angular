import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { mapJHipsterUserToAppUser } from '../adapters/user.adapter';
import { AppUser } from '../models/app-user.model';

interface AdminUserDto {
  id: number;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  authorities: string[];
}

export interface UserListResult {
  items: AppUser[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiUrl}/admin/users`;

  getUsers(params: { page?: number; size?: number } = {}): Observable<AppUser[]> {
    return this.getUsersList(params).pipe(map((result) => result.items));
  }

  getUsersList(params: { page?: number; size?: number } = {}): Observable<UserListResult> {
    const page = Math.max(0, Math.floor(params.page ?? 0));
    const size = Math.max(1, Math.floor(params.size ?? 20));

    const httpParams = new HttpParams().set('page', String(page)).set('size', String(size));

    return this.http
      .get<AdminUserDto[]>(this.usersUrl, {
        params: httpParams,
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          items: (response.body ?? []).map(mapJHipsterUserToAppUser),
          total: Number(response.headers.get('X-Total-Count') ?? (response.body?.length ?? 0)),
        })),
      );
  }
}
