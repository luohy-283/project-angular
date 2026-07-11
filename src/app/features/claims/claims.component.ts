import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, merge, of, skip, startWith, Subject, switchMap, tap } from 'rxjs';
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
import { Claim } from '../../core/models/claim.model';

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
  private readonly listChange$ = new Subject<void>();

  readonly keyword = signal('');
  readonly status = signal<Claim['trangThaiHoSo'] | null>(null);
  readonly type = signal<Claim['loaiHoSo'] | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly claims = signal<Claim[]>([]);
  readonly total = signal(0);
  readonly error = signal(false);

  private readonly keyword$ = toObservable(this.keyword);
  private readonly status$ = toObservable(this.status);
  private readonly type$ = toObservable(this.type);
  private readonly pageIndex$ = toObservable(this.pageIndex);

  readonly claimStatuses = ['Mới tiếp nhận', 'Đang xử lý', 'Đã hoàn thành', 'Đã hủy'];
  readonly claimTypes: Claim['loaiHoSo'][] = ['TTTT', 'BLT'];

  ngOnInit(): void {
    const keywordChange$ = this.keyword$
      .pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.pageIndex.set(0);
        }),
      );

    merge(keywordChange$, this.listChange$)
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

  onStatusChange(value: Claim['trangThaiHoSo'] | null): void {
    this.status.set(value);
    this.pageIndex.set(0);
    this.listChange$.next();
  }

  onTypeChange(value: Claim['loaiHoSo'] | null): void {
    this.type.set(value);
    this.pageIndex.set(0);
    this.listChange$.next();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.listChange$.next();
  }

  private loadClaimsList() {
    this.loading.set(true);
    this.error.set(false);

    return this.claimService
      .getClaimsList({
        keyword: this.keyword(),
        status: this.status(),
        type: this.type(),
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
