import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { Claim, ClaimListResponse } from '../models/claim.model';

export type ClaimPayload = Omit<Claim, 'id'> & {
  id: string;
  maCskcb?: string;
  tenCskcb?: string;
  phuongThucNhanHs?: string;
  ngayDuyet?: string | null;
};

export type ClaimCreatePayload = Omit<ClaimPayload, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'mock-claims';
  private readonly claimsPath = 'assets/mock-data/claims.json';

  getClaims(params: { pageIndex: number; pageSize: number }): Observable<ClaimListResponse> {
    const safePageIndex = Math.max(0, Math.floor(params.pageIndex));
    const safePageSize = Math.max(1, Math.floor(params.pageSize));
    const startIndex = safePageIndex * safePageSize;

    const storedClaims = this.readStoredClaims();
    if (storedClaims.length > 0) {
      const pagedClaims = storedClaims.slice(startIndex, startIndex + safePageSize);
      return of({ items: pagedClaims, total: storedClaims.length });
    }

    return this.http.get<ClaimListResponse>(this.claimsPath).pipe(
      tap((response) => this.persistClaims(response.items ?? [])),
      map((response) => {
        const items = response.items ?? [];
        return {
          items: items.slice(startIndex, startIndex + safePageSize),
          total: response.total ?? items.length,
        };
      }),
    );
  }

  getById(id: string): Observable<ClaimPayload | null> {
    return this.getClaims({ pageIndex: 0, pageSize: 1000 }).pipe(map((response) => response.items.find((claim) => claim.id === id) ?? null));
  }

  create(claim: ClaimCreatePayload): Observable<ClaimPayload> {
    return this.getClaims({ pageIndex: 0, pageSize: 1000 }).pipe(
      map((response) => response.items),
      map((items) => {
        const nextClaim: ClaimPayload = {
          ...claim,
          id: this.generateId(items),
          ngayDuyet: claim.ngayDuyet ?? null,
        };
        const nextItems = [...items, nextClaim as ClaimPayload];
        this.persistClaims(nextItems);
        return nextClaim;
      }),
    );
  }

  update(id: string, claim: Partial<ClaimPayload>): Observable<ClaimPayload> {
    return this.getClaims({ pageIndex: 0, pageSize: 1000 }).pipe(
      map((response) => response.items),
      map((items) => {
        const currentClaim = items.find((item) => item.id === id);
        if (!currentClaim) {
          throw new Error('Claim not found');
        }

        const updatedClaim: ClaimPayload = { ...currentClaim, ...claim, id };
        const nextItems = items.map((item) => (item.id === id ? updatedClaim : item));
        this.persistClaims(nextItems);
        return updatedClaim;
      }),
    );
  }

  delete(id: string): Observable<boolean> {
    return this.getClaims({ pageIndex: 0, pageSize: 1000 }).pipe(
      map((response) => response.items),
      map((items) => {
        const hasClaim = items.some((item) => item.id === id);
        if (!hasClaim) {
          return false;
        }

        const nextItems = items.filter((item) => item.id !== id);
        this.persistClaims(nextItems);
        return true;
      }),
    );
  }

  private readStoredClaims(): ClaimPayload[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const storedValue = window.localStorage.getItem(this.storageKey);
    if (!storedValue) {
      return [];
    }

    try {
      return JSON.parse(storedValue) as ClaimPayload[];
    } catch {
      return [];
    }
  }

  private persistClaims(claims: ClaimPayload[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(claims));
  }

  private generateId(items: ClaimPayload[]): string {
    const numericIds = items
      .map((item) => item.id)
      .filter((item): item is string => Boolean(item))
      .map((item) => Number(item?.replace(/\D/g, '')))
      .filter((item) => Number.isFinite(item));

    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    return `HSBT${String(maxId + 1).padStart(3, '0')}`;
  }
}
