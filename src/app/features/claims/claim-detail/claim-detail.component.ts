import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Claim } from '../../../core/models/claim.model';
import { ClaimService } from '../../../core/services/claim.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TINH_TRANG_DUYET_LABEL, TRANG_THAI_LABEL } from '../../../shared/constants/claim-status.const';

type ClaimDetailValue = Claim & {
  maCskcb?: string;
  tenCskcb?: string;
  phuongThucNhanHs?: string;
};

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, LoadingComponent, EmptyStateComponent, StatusBadgeComponent, RouterLink, MatButtonModule],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.scss',
})
export class ClaimDetailComponent implements OnInit {
  id = '';
  claim: ClaimDetailValue | null = null;
  loading = false;

  readonly trangThaiLabel = TRANG_THAI_LABEL;
  readonly tinhTrangDuyetLabel = TINH_TRANG_DUYET_LABEL;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly claimService = inject(ClaimService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadClaim();
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

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.claimService.delete(this.id).subscribe({
          next: () => this.router.navigate(['/claims']),
          error: () => this.router.navigate(['/claims']),
        });
      }
    });
  }

  private loadClaim(): void {
    if (!this.id) {
      return;
    }

    this.loading = true;
    this.claimService.getById(this.id).subscribe({
      next: (claim) => {
        this.claim = (claim as ClaimDetailValue | null) ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
