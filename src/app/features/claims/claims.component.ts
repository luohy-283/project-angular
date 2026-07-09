import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ClaimService } from '../../core/services/claim.service';
import { Claim } from '../../core/models/claim.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [PageTitleComponent, LoadingComponent, EmptyStateComponent, StatusBadgeComponent, PaginationComponent, MatButtonModule, RouterLink],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
})
export class ClaimsComponent implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  error = false;
  claims: Claim[] = [];
  pageIndex = 0;
  pageSize = 10;
  total = 0;

  ngOnInit(): void {
    this.loadClaims();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClaims();
  }

  private loadClaims(): void {
    this.loading = true;
    this.error = false;

    this.claimService
      .getClaims({ pageIndex: this.pageIndex, pageSize: this.pageSize })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.claims = response.items;
          this.total = response.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
          this.claims = [];
          this.total = 0;
        },
      });
  }
}
