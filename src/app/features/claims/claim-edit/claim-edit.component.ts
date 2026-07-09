import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimCreatePayload, ClaimPayload, ClaimService } from '../../../core/services/claim.service';
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

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly claimService = inject(ClaimService);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.id) {
      return;
    }

    this.loading = true;
    this.claimService.getById(this.id).subscribe({
      next: (claim) => {
        this.initialValue = claim ?? undefined;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSubmit(claim: ClaimCreatePayload): void {
    if (!this.id) {
      return;
    }

    this.claimService.update(this.id, claim).subscribe({
      next: () => this.router.navigate(['/claims', this.id]),
      error: () => this.router.navigate(['/claims', this.id]),
    });
  }

  onCancel(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Hủy chỉnh sửa hồ sơ',
        message: 'Bạn có chắc muốn hủy chỉnh sửa? Mọi thay đổi chưa lưu sẽ bị mất.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.router.navigate(['/claims', this.id]);
      }
    });
  }
}
