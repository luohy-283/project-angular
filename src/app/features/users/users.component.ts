import { Component, inject, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { AppUser } from '../../core/models/app-user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [PageTitleComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);

  users: AppUser[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.users = [];
        this.errorMessage = error instanceof Error ? error.message : 'Unable to load users.';
        this.isLoading = false;
      },
    });
  }
}
