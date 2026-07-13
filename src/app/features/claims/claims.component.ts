import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  merge,
  of,
  shareReplay,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';
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
import { Claim, ClaimQueryParams, TrangThaiHoSo } from '../../core/models/claim.model';
import { getTinhTrangDuyetLabel, getTrangThaiLabel } from '../../core/utils/claim-label.util';
import { TRANG_THAI_OPTIONS } from '../../shared/constants/claim-status.const';

interface ClaimsQueryState {
  keyword: string;
  trangThaiHoSo: TrangThaiHoSo | null;
  loaiHoSo: Claim['loaiHoSo'] | null;
  pageIndex: number;
  pageSize: number;
}

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
  readonly loaiHoSo = signal<Claim['loaiHoSo'] | null>(null);
  readonly pageState = signal({ pageIndex: 0, pageSize: 10 });
  readonly loading = signal(false);
  readonly claims = signal<Claim[]>([]);
  readonly total = signal(0);
  readonly error = signal(false);

  private readonly keyword$ = toObservable(this.keyword);
  private readonly trangThaiHoSo$ = toObservable(this.trangThaiHoSo);
  private readonly loaiHoSo$ = toObservable(this.loaiHoSo);
  private readonly pageState$ = toObservable(this.pageState);

  readonly trangThaiOptions = TRANG_THAI_OPTIONS as TrangThaiHoSo[];
  readonly getTrangThaiLabel = getTrangThaiLabel;
  readonly getTinhTrangDuyetLabel = getTinhTrangDuyetLabel;
  readonly claimTypes: Claim['loaiHoSo'][] = ['TTTT', 'BLT'];

  ngOnInit(): void {
    const keywordShared$ = this.keyword$.pipe(shareReplay({ bufferSize: 1, refCount: true }));
    const keywordDebounced$ = merge(
      keywordShared$.pipe(take(1)),
      keywordShared$.pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.pageState.update((state) => ({ ...state, pageIndex: 0 }));
        }),
      ),
    );

    combineLatest({
      keyword: keywordDebounced$,
      trangThaiHoSo: this.trangThaiHoSo$,
      loaiHoSo: this.loaiHoSo$,
      pageState: this.pageState$,
    })
      .pipe(
        map((sources) => ({
          keyword: sources.keyword,
          trangThaiHoSo: sources.trangThaiHoSo,
          loaiHoSo: sources.loaiHoSo,
          pageIndex: sources.pageState.pageIndex,
          pageSize: sources.pageState.pageSize,
        })),
        distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),
        switchMap((query) => this.loadClaimsList(query)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onKeywordChange(value: string): void {
    this.keyword.set(value ?? '');
  }

  onTrangThaiHoSoChange(value: TrangThaiHoSo | null): void {
    this.trangThaiHoSo.set(value);
    this.pageState.update((state) => ({ ...state, pageIndex: 0 }));
  }

  onLoaiHoSoChange(value: Claim['loaiHoSo'] | null): void {
    this.loaiHoSo.set(value);
    this.pageState.update((state) => ({ ...state, pageIndex: 0 }));
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageState.set(event);
  }

  hasActiveFilters(): boolean {
    return Boolean(this.keyword().trim() || this.trangThaiHoSo() || this.loaiHoSo());
  }

  pageIndex(): number {
    return this.pageState().pageIndex;
  }

  pageSize(): number {
    return this.pageState().pageSize;
  }

  private loadClaimsList(query: ClaimsQueryState) {
    this.loading.set(true);
    this.error.set(false);

    const params: ClaimQueryParams = {
      keyword: query.keyword,
      trangThaiHoSo: query.trangThaiHoSo,
      loaiHoSo: query.loaiHoSo,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
    };

    return this.claimService.getClaimsList(params).pipe(
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
