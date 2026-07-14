import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Claim, ClaimListResult, ClaimQueryParams } from '../models/claim.model';
import { getPaginationTotal } from '../utils/pagination-header.util';

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
  private readonly claimsUrl = `${environment.apiUrl}/claims`;

  getClaimsList(params: ClaimQueryParams): Observable<ClaimListResult> {
    const safePageIndex = Math.max(0, Math.floor(params.pageIndex));
    const safePageSize = Math.max(1, Math.floor(params.pageSize));

    let httpParams = this.buildFilterParams(params)
      .set('page', String(safePageIndex))
      .set('size', String(safePageSize));

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    return this.http
      .get<Claim[]>(this.claimsUrl, {
        params: httpParams,
        observe: 'response',
      })
      .pipe(
        switchMap((response) => {
          const items = response.body ?? [];
          const totalFromHeader = getPaginationTotal(response.headers);

          if (totalFromHeader !== null) {
            return of({ items, total: totalFromHeader });
          }

          return this.getClaimsCount(params).pipe(
            map((total) => ({
              items,
              total,
            })),
          );
        }),
      );
  }

  getById(id: string): Observable<ClaimPayload | null> {
    return this.http.get<ClaimPayload>(`${this.claimsUrl}/${id}`).pipe(map((claim) => claim ?? null));
  }

  create(claim: ClaimCreatePayload): Observable<ClaimPayload> {
    return this.http.post<ClaimPayload>(this.claimsUrl, claim);
  }

  update(id: string, claim: Partial<ClaimPayload>): Observable<ClaimPayload> {
    return this.http.put<ClaimPayload>(`${this.claimsUrl}/${id}`, { ...claim, id });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.claimsUrl}/${id}`);
  }

  private getClaimsCount(params: ClaimQueryParams): Observable<number> {
    return this.http
      .get<number>(`${this.claimsUrl}/count`, {
        params: this.buildFilterParams(params),
      })
      .pipe(map((count) => Number(count)));
  }

  private buildFilterParams(params: ClaimQueryParams): HttpParams {
    let httpParams = new HttpParams();
    const keyword = params.keyword?.trim();

    if (keyword) {
      httpParams = httpParams.set('keyword', keyword);
    } else {
      if (params.trangThaiHoSo) {
        httpParams = httpParams.set('trangThaiHoSo.equals', params.trangThaiHoSo);
      }

      if (params.loaiHoSo) {
        httpParams = httpParams.set('loaiHoSo.equals', params.loaiHoSo);
      }
    }

    return httpParams;
  }
}
