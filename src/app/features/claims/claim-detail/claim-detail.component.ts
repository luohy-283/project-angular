import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [PageTitleComponent, StatusBadgeComponent],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.scss',
})
export class ClaimDetailComponent implements OnInit {
  id = 'unknown';
  readonly showMessage = true;
  readonly items: { id: number; status: string }[] = [
    { id: 1, status: 'Open' },
    { id: 2, status: 'Closed' },
  ];
  readonly status = 'open';

  private route = inject(ActivatedRoute);
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? 'unknown';
  }
}
