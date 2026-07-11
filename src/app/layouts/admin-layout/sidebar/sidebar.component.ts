import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MENU_ITEMS } from '../../../shared/constants/menu.const';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatListModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  get visibleMenuItems() {
    const currentRole = this.authService.getCurrentRole();

    return MENU_ITEMS.filter((item) => (item.path === '/users' ? currentRole === 'ADMIN' : true));
  }
}
