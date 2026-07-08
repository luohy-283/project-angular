import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-claim-edit',
  standalone: true,
  imports: [PageTitleComponent, StatusBadgeComponent],
  templateUrl: './claim-edit.component.html',
  styleUrl: './claim-edit.component.scss',
})
export class ClaimEditComponent implements OnInit {
  id = 'unknown';
  readonly showMessage = true;
  readonly items: Array<{ id: number; status: string }> = [
    { id: 1, status: 'Draft' },
    { id: 2, status: 'Pending' },
  ];
  readonly status = 'pending';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? 'unknown';
  }
}
