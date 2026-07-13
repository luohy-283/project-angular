import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { ClaimCreatePayload, ClaimPayload, ClaimService } from '../../../core/services/claim.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ClaimFormComponent } from '../claim-form/claim-form.component';

@Component({
  selector: 'app-claim-edit',
  standalone: true,
  imports: [PageTitleComponent, LoadingComponent, EmptyStateComponent, ClaimFormComponent],
  templateUrl: './claim-edit.component.html',
  styleUrl: './claim-edit.component.scss',
})
export class ClaimEditComponent implements OnInit {
  id = '';
  initialValue?: ClaimPayload;
  loading = false;
  loadError = false;
  submitError = '';
  isSubmitting = false;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly claimService = inject(ClaimService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.id = params.get('id') ?? '';
          this.initialValue = undefined;
          this.loadError = false;
          this.submitError = '';

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
        this.initialValue = claim ?? undefined;
      });
  }

  onSubmit(claim: ClaimCreatePayload): void {
    if (!this.id) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.claimService
      .update(this.id, { ...claim, id: this.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/claims', this.id]),
        error: (error: unknown) => {
          this.isSubmitting = false;
          this.submitError = getHttpErrorMessage(error, 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
        },
      });
  }

  onCancel(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Hủy chỉnh sửa hồ sơ',
        message: 'Bạn có chắc muốn hủy chỉnh sửa? Mọi thay đổi chưa lưu sẽ bị mất.',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.router.navigate(['/claims', this.id]);
        }
      });
  }
}
