import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { ClaimPayload, ClaimService } from '../../../core/services/claim.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { getTinhTrangDuyetLabel, getTrangThaiLabel } from '../../../core/utils/claim-label.util';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, LoadingComponent, EmptyStateComponent, StatusBadgeComponent, RouterLink, MatButtonModule],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.scss',
})
export class ClaimDetailComponent implements OnInit {
  id = '';
  claim: ClaimPayload | null = null;
  loading = false;
  loadError = false;
  actionError = '';

  readonly getTrangThaiLabel = getTrangThaiLabel;
  readonly getTinhTrangDuyetLabel = getTinhTrangDuyetLabel;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly claimService = inject(ClaimService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.id = params.get('id') ?? '';
          this.claim = null;
          this.loadError = false;
          this.actionError = '';

          if (!this.id) {
            return of(null);
          }

          this.loading = true;
          return this.claimService.getById(this.id).pipe(
            catchError(() => {
              this.loadError = true;
              return of(null);
            }),
            finalize(() => {
              this.loading = false;
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((claim) => {
        this.claim = claim;
      });
  }

  onDelete(): void {
    if (!this.id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Xóa hồ sơ',
        message: 'Bạn có chắc muốn xóa hồ sơ này? Thao tác này không thể hoàn tác.',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean | undefined) => {
        if (!confirmed) {
          return;
        }

        this.actionError = '';
        this.claimService
          .delete(this.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.router.navigate(['/claims']),
            error: (error: unknown) => {
              this.actionError = getHttpErrorMessage(error, 'Không thể xóa hồ sơ. Vui lòng thử lại.');
            },
          });
      });
  }
}
