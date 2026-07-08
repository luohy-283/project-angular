import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ClaimService } from '../../core/services/claim.service';
import { Claim } from '../../core/models/claim.model';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [PageTitleComponent, LoadingComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
})
export class ClaimsComponent implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  error = false;
  claims: Claim[] = [];

  ngOnInit(): void {
    this.loadClaims();
  }

  private loadClaims(): void {
    this.loading = true;
    this.error = false;

    this.claimService
      .getClaims()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.claims = response.items;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
          this.claims = [];
        },
      });
  }
}
