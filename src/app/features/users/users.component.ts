import { Component } from '@angular/core';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [PageTitleComponent, StatusBadgeComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  readonly showMessage = true;
  readonly items: Item[] = [
    { id: 1, status: 'Active' },
    { id: 2, status: 'Inactive' },
  ];
  readonly status = 'active';
}
interface Item{
  id: number;
  status: string;
}
