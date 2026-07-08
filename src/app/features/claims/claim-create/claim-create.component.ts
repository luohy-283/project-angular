import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-claim-create',
  standalone: true,
  imports: [PageTitleComponent, StatusBadgeComponent],
  templateUrl: './claim-create.component.html',
  styleUrl: './claim-create.component.scss',
})
export class ClaimCreateComponent {
  readonly showMessage = true;
  readonly items: { id: number; status: string }[] = [
    { id: 1, status: 'New' },
    { id: 2, status: 'Review' },
  ];
  readonly status = 'draft';
}
