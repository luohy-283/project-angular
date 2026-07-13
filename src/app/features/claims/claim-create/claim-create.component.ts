import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClaimCreatePayload, ClaimService } from '../../../core/services/claim.service';
import { getHttpErrorMessage } from '../../../core/utils/http-error.util';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ClaimFormComponent } from '../claim-form/claim-form.component';

@Component({
  selector: 'app-claim-create',
  standalone: true,
  imports: [PageTitleComponent, ClaimFormComponent],
  templateUrl: './claim-create.component.html',
  styleUrl: './claim-create.component.scss',
})
export class ClaimCreateComponent {
  private readonly claimService = inject(ClaimService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  submitError = '';
  isSubmitting = false;

  onSubmit(claim: ClaimCreatePayload): void {
    this.isSubmitting = true;
    this.submitError = '';

    this.claimService
      .create(claim)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/claims']),
        error: (error: unknown) => {
          this.isSubmitting = false;
          this.submitError = getHttpErrorMessage(error, 'Không thể tạo hồ sơ. Vui lòng thử lại.');
        },
      });
  }

  onCancel(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Hủy tạo hồ sơ',
        message: 'Bạn có chắc muốn hủy thao tác tạo hồ sơ? Mọi thay đổi chưa lưu sẽ bị mất.',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.router.navigate(['/claims']);
        }
      });
  }
}
