import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { AppUser } from '../../core/models/app-user.model';
import { UserService } from '../../core/services/user.service';
import { getHttpErrorMessage } from '../../core/utils/http-error.util';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [PageTitleComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  users: AppUser[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.users = [];
          this.errorMessage = getHttpErrorMessage(error, 'Không thể tải danh sách người dùng.');
          this.isLoading = false;
        },
      });
  }
}
