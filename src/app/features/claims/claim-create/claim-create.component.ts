import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClaimCreatePayload, ClaimService } from '../../../core/services/claim.service';
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

  onSubmit(claim: ClaimCreatePayload): void {
    this.claimService.create(claim).subscribe({
      next: () => this.router.navigate(['/claims']),
      error: () => this.router.navigate(['/claims']),
    });
  }

  onCancel(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Hủy tạo hồ sơ',
        message: 'Bạn có chắc muốn hủy thao tác tạo hồ sơ? Mọi thay đổi chưa lưu sẽ bị mất.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.router.navigate(['/claims']);
      }
    });
  }
}
