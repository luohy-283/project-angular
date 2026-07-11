import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, merge, of, skip, startWith, switchMap, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ClaimService } from '../../core/services/claim.service';
import { Claim, TrangThaiHoSo } from '../../core/models/claim.model';
import {
  TINH_TRANG_DUYET_LABEL,
  TRANG_THAI_LABEL,
  TRANG_THAI_OPTIONS,
} from '../../shared/constants/claim-status.const';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [
    PageTitleComponent,
    LoadingComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    PaginationComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
})
export class ClaimsComponent implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly destroyRef = inject(DestroyRef);

  readonly keyword = signal('');
  readonly trangThaiHoSo = signal<TrangThaiHoSo | null>(null);
  readonly type = signal<Claim['loaiHoSo'] | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly claims = signal<Claim[]>([]);
  readonly total = signal(0);
  readonly error = signal(false);

  private readonly keyword$ = toObservable(this.keyword);
  private readonly trangThaiHoSo$ = toObservable(this.trangThaiHoSo);
  private readonly type$ = toObservable(this.type);
  private readonly pageIndex$ = toObservable(this.pageIndex);
  private readonly pageSize$ = toObservable(this.pageSize);

  readonly trangThaiOptions = TRANG_THAI_OPTIONS;
  readonly trangThaiLabel = TRANG_THAI_LABEL;
  readonly tinhTrangDuyetLabel = TINH_TRANG_DUYET_LABEL;
  readonly claimTypes: Claim['loaiHoSo'][] = ['TTTT', 'BLT'];

  ngOnInit(): void {
    const keywordChange$ = this.keyword$.pipe(
      skip(1),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.pageIndex.set(0);
      }),
    );

    merge(keywordChange$, this.trangThaiHoSo$, this.type$, this.pageIndex$, this.pageSize$)
      .pipe(
        startWith(null),
        switchMap(() => this.loadClaimsList()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onKeywordChange(value: string): void {
    this.keyword.set(value);
  }

  onTrangThaiHoSoChange(value: TrangThaiHoSo | null): void {
    this.trangThaiHoSo.set(value);
    this.pageIndex.set(0);
  }

  onTypeChange(value: Claim['loaiHoSo'] | null): void {
    this.type.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  private loadClaimsList() {
    this.loading.set(true);
    this.error.set(false);

    return this.claimService
      .getClaimsList({
        keyword: this.keyword(),
        trangThaiHoSo: this.trangThaiHoSo(),
        loaiHoSo: this.type(),
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize(),
      })
      .pipe(
        tap((response) => {
          this.claims.set(response.items);
          this.total.set(response.total);
        }),
        catchError(() => {
          this.error.set(true);
          this.claims.set([]);
          this.total.set(0);
          return of({ items: [], total: 0 });
        }),
        finalize(() => {
          this.loading.set(false);
        }),
      );
  }
}
