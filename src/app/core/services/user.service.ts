import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { mapPublicUsersToAppUsers } from '../adapters/user.adapter';
import { AppUser } from '../models/app-user.model';
import { PublicUser } from '../models/public-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly usersApiUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly usersFallbackPath = 'assets/mock-data/users.json';

  getUsers(): Observable<AppUser[]> {
    return this.http.get<PublicUser[]>(this.usersApiUrl).pipe(
      map((users) => mapPublicUsersToAppUsers(users)),
      catchError(() => this.getFallbackUsers()),
    );
  }

  private getFallbackUsers(): Observable<AppUser[]> {
    return this.http.get<PublicUser[]>(this.usersFallbackPath).pipe(
      map((users) => mapPublicUsersToAppUsers(users)),
      catchError(() => throwError(() => new Error('Unable to load users from the public API or fallback data.'))),
    );
  }
}
