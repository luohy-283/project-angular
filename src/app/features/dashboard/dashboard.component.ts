import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageTitleComponent, LoadingComponent, EmptyStateComponent, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  error = false;
  summary: Dashboard | null = null;

  ngOnInit(): void {
    this.loadSummary();
  }

  private loadSummary(): void {
    this.loading = true;
    this.error = false;

    this.dashboardService
      .getSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          this.summary = summary;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
          this.summary = null;
        },
      });
  }
}
