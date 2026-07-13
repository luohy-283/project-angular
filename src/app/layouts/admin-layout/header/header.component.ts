import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService, Account } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentAccount = toSignal(this.authService.currentAccount$, { initialValue: null });

  getDisplayName(account: Account): string {
    const fullName = [account.firstName, account.lastName].filter(Boolean).join(' ').trim();
    return fullName || account.login;
  }

  getRole(account: Account): string {
    return account.authorities.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
